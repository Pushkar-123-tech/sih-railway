import { useEffect, useState } from "react";
import { WORKS, PLANS } from "../data/mockData";
import { readJSON, writeJSON, removeStorage } from "../utils/storage";
import { api } from "../api/client";

const key = "railplan-demo-v7";
const freshState = () => ({
  works: WORKS.map((w) => ({ ...w, dependencies: [...(w.dependencies || [])] })),
  plans: PLANS.map((p) => ({ ...p, departments: [...(p.departments || [])], works: [...(p.works || [])] })),
});
const validState = (x) => x && Array.isArray(x.works) && Array.isArray(x.plans) && x.works.every((w) => w && w.id && w.dept) && x.plans.every((p) => p && p.id);
const normalizeWork = (w) => ({
  ...w,
  id: w.work_id,
  title: w.work_type?.replaceAll("_", " ") || "Work item",
  dept: w.department,
  corridor: w.route,
  section: w.route,
  asset: w.asset_type,
  criticality: w.priority_class || "Medium",
  risk: Math.round((w.risk_score || 0) * 100),
  overdue: w.days_overdue || 0,
  duration: Math.round((w.predicted_duration_hours || 0) * 60),
  preferred: `${String(w.preferred_window_hour ?? 0).padStart(2, "0")}:00`,
  assignedTo: w.assigned_to,
  assignedToName: w.assigned_to_name,
  scheduledDate: w.scheduled_date,
  scheduledStart: w.scheduled_start,
  scheduledEnd: w.scheduled_end,
  durationLimit: w.duration_limit_minutes || Math.round((w.predicted_duration_hours || 0) * 60),
  allocatedAsset: w.allocated_asset || w.asset_type,
  dependencies: [],
  created: new Date(w.created_at || Date.now()).toLocaleDateString("en-GB"),
  ai: { priorityScore: w.priority_score, riskClass: w.risk_class, predictedDurationHours: w.predicted_duration_hours },
});
const normalizePlan = (p) => ({
  ...p,
  id: p.plan_id,
  date: p.block_date ? new Date(`${p.block_date}T00:00:00`).toLocaleDateString("en-GB") : new Date(p.created_at || Date.now()).toLocaleDateString("en-GB"),
  window: `${p.block_start || "00:00"}–${p.block_end || "02:00"}`,
  corridor: p.route,
  section: p.route,
  status: p.status,
  departments: p.departments || [],
  works: p.work_ids || [],
  score: p.score,
  impact: "Calculated",
  conflicts: 0,
});

export function resetDemoData() {
  removeStorage(key);
  localStorage.removeItem("railplan_token");
  localStorage.removeItem("railplan_role");
}

export function useAppStore() {
  const [state, setState] = useState(() => {
    const saved = readJSON(key, null);
    return validState(saved) ? saved : freshState();
  });
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      const token = localStorage.getItem("railplan_token");
      if (!token) return;

      try {
        const [works, plans] = await Promise.all([api.works(), api.plans()]);
        if (!active) return;
        setState({
          works: works.map(normalizeWork),
          plans: plans.map(normalizePlan),
        });
        setConnected(true);
      } catch (error) {
        console.warn("Backend unavailable; using local demo state", error);
        setConnected(false);
      }
    })();

    return () => { active = false; };
  }, []);

  useEffect(() => {
    writeJSON(key, state);
  }, [state]);

  const updateWork = async (id, patch) => {
    try {
      let result;
      if (patch.status === "Executing") result = await api.startExecution(id);
      else if (patch.status === "Completion Submitted") result = await api.completeExecution(id, { notes: "Completion submitted from execution board", actual_duration_minutes: patch.actual_duration_minutes || null });
      else if (patch.status === "Verified") result = await api.verifyCompletion(id, { approved: true, notes: "Verified by Control" });
      else result = await api.updateWork(id, patch);

      const normalized = normalizeWork(result);
      setState((s) => ({ ...s, works: s.works.map((w) => (w.id === id ? { ...w, ...normalized } : w)) }));
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const addWork = async (work) => {
    setState((s) => ({ ...s, works: [work, ...s.works] }));
  };

  const updatePlan = async (id, patch) => {
    try {
      let result;
      if (patch.status === "Approved") result = await api.approvePlan(id, { notes: "Approved by Control" });
      else if (patch.status === "Rejected") result = await api.rejectPlan(id, { notes: "Rejected by Control" });
      else if (patch.status === "Published") result = await api.publishPlan(id);
      else result = patch;

      if (result && result.plan_id) {
        const normalized = normalizePlan(result);
        setState((s) => ({ ...s, plans: s.plans.map((p) => (p.id === id ? { ...p, ...normalized } : p)) }));
      } else {
        setState((s) => ({ ...s, plans: s.plans.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const generatePlan = async (payload) => {
    const result = await api.generatePlan(payload);
    const normalized = normalizePlan(result);
    setState((s) => ({ ...s, plans: [normalized, ...s.plans] }));
    return normalized;
  };

  return { ...state, updateWork, addWork, updatePlan, generatePlan, connected };
}
