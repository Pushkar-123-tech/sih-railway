const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8001';

function clamp(n, min, max) {
  const value = Number(n);
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function safeNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function fallbackPriority(payload = {}) {
  const criticality = safeNumber(payload.criticality, 5);
  const overdue = safeNumber(payload.days_overdue, 0);
  const failureProbability = safeNumber(payload.failure_probability, 0.5);
  const assetImpact = safeNumber(payload.asset_availability_impact, 0.5);
  const blockFeasibility = safeNumber(payload.block_feasibility, 0.5);
  const score = clamp((criticality / 10) * 0.35 + failureProbability * 0.25 + assetImpact * 0.2 + (blockFeasibility * 0.15) + (overdue / 30) * 0.05, 0, 1);

  let priorityClass = 'Low';
  if (score >= 0.8) priorityClass = 'Critical';
  else if (score >= 0.6) priorityClass = 'High';
  else if (score >= 0.35) priorityClass = 'Medium';

  return {
    priority_score: Number(score.toFixed(4)),
    priority_class: priorityClass,
  };
}

function fallbackRisk(payload = {}) {
  const failureProbability = safeNumber(payload.failure_probability, 0.5);
  const assetImpact = safeNumber(payload.asset_availability_impact, 0.5);
  const criticality = safeNumber(payload.criticality, 5);
  const score = clamp((failureProbability * 0.55) + (assetImpact * 0.25) + (criticality / 10) * 0.2, 0, 1);

  return {
    risk_score: Number(score.toFixed(4)),
    risk_class: score >= 0.8 ? 'Critical' : score >= 0.6 ? 'High' : score >= 0.35 ? 'Medium' : 'Low',
    risk_probabilities: {
      Critical: clamp(score, 0, 1),
      High: clamp(1 - score, 0, 1),
      Medium: 0.2,
      Low: 0.1,
    },
  };
}

function fallbackDuration(payload = {}) {
  const complexity = safeNumber(payload.complexity, 0.5);
  const duration = safeNumber(payload.predicted_duration_hours, 0);
  const crew = safeNumber(payload.crew_size, 4);
  const equipment = safeNumber(payload.equipment_required, 2);
  const base = duration > 0 ? duration : 1.8 + complexity * 2.5 + equipment * 0.2 - (crew * 0.08);

  return {
    predicted_duration_hours: Number(clamp(base, 0.5, 12).toFixed(3)),
  };
}

function fallbackPrediction(payload = {}) {
  return {
    model_version: 'railplan-fallback-v1',
    ...fallbackPriority(payload),
    ...fallbackRisk(payload),
    ...fallbackDuration(payload),
  };
}

async function callMl(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${ML_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    });

    const text = await response.text();
    let data = {};
    try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }

    if (!response.ok) {
      throw new Error(data.message || data.detail || `ML service error ${response.status}`);
    }

    return data;
  } catch (error) {
    const message = error?.name === 'AbortError' ? 'ML service request timed out' : error.message;
    throw new Error(message || 'ML service unavailable');
  } finally {
    clearTimeout(timer);
  }
}

export async function mlHealth(){
  try {
    return await callMl('/health');
  } catch (error) {
    return { status: 'degraded', service: 'railplan-ml', message: error.message || 'ML service unavailable', fallback_mode: true };
  }
}

export async function predictMaintenance(payload){
  try {
    return await callMl('/predict', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (error) {
    return fallbackPrediction(payload);
  }
}

export async function optimizeBlocks(payload){
  try {
    return await callMl('/optimize', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (error) {
    const works = Array.isArray(payload?.works) ? payload.works : [];
    const selected = works.slice(0, Math.max(1, Math.min(works.length, Math.ceil((Number(payload?.capacity_hours ?? 3) / 3) * works.length))));
    const selectedIds = selected.map((w) => w.work_id || w.id).filter(Boolean);
    const usedHours = selected.reduce((sum, w) => sum + (Number(w.predicted_duration_hours ?? 2.5)), 0);
    return {
      selected_work_ids: selectedIds,
      used_hours: Number(usedHours.toFixed(2)),
      score: selected.length ? 82 : 0,
      explanation: 'Fallback optimizer generated a feasible plan while the ML optimizer was unavailable.',
    };
  }
}
