import { connectDB } from '@/lib/db';
import { Log } from '@/models/Log';

interface LogEntry {
  action: string;
  category: 'registration' | 'tournament' | 'user' | 'schedule' | 'winner' | 'system' | 'profile';
  details?: string;
  performedBy: string;
  targetId?: string;
  targetName?: string;
  ip?: string;
}

export async function addLog(entry: LogEntry) {
  try {
    await connectDB();
    await Log.create(entry);
  } catch (err) {
    console.error('[LOG ERROR]', err);
  }
}
