import { JSONFilePreset } from 'lowdb/node';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbFile = process.env.DB_FILE || path.resolve(__dirname, '../../data/railplan.json');
const defaults = { users: [], works: [], plans: [], audit: [] };
export const db = await JSONFilePreset(dbFile, defaults);
export async function save(){ await db.write(); }
