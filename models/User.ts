import mongoose, { Schema, Document, models } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  image: string;
  provider: string;
  firstLoginAt: Date;
  lastLoginAt: Date;
  loginCount: number;
  isBanned: boolean;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, default: '' },
  image: { type: String, default: '' },
  provider: { type: String, default: 'google' },
  firstLoginAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: Date.now },
  loginCount: { type: Number, default: 1 },
  isBanned: { type: Boolean, default: false },
});

export const User = models.User || mongoose.model<IUser>('User', UserSchema);
