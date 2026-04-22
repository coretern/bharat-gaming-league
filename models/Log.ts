import mongoose, { Schema, Document } from 'mongoose';

export interface ILog extends Document {
  action: string;
  category: 'registration' | 'tournament' | 'user' | 'schedule' | 'winner' | 'system' | 'profile';
  details: string;
  performedBy: string;
  targetId?: string;
  targetName?: string;
  ip?: string;
  createdAt: Date;
}

const LogSchema = new Schema<ILog>({
  action: { type: String, required: true },
  category: { type: String, required: true, enum: ['registration', 'tournament', 'user', 'schedule', 'winner', 'system', 'profile'] },
  details: { type: String, default: '' },
  performedBy: { type: String, required: true },
  targetId: { type: String, default: '' },
  targetName: { type: String, default: '' },
  ip: { type: String, default: '' },
}, { timestamps: true });

LogSchema.index({ createdAt: -1 });
LogSchema.index({ category: 1, createdAt: -1 });

if (mongoose.models.Log) {
  delete mongoose.models.Log;
}

export const Log = mongoose.model<ILog>('Log', LogSchema);
