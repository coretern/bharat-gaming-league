import mongoose, { Schema, Document, models } from 'mongoose';

export interface ISavedPlayer {
  name: string;
  uid: string;
  instagram: string;
}

export interface IUser extends Document {
  email: string;
  name: string;
  image: string;
  provider: string;
  firstLoginAt: Date;
  lastLoginAt: Date;
  loginCount: number;
  isBanned: boolean;
  role?: string;
  password?: string;
  otp?: string | null;
  otpExpiry?: Date | null;
  phoneNumber?: string;
  // Gaming Profile
  teamName: string;
  gameUsername: string;
  gameUID: string;
  whatsapp: string;
  instagram: string;
  paymentQrUrl: string;
  savedPlayers: ISavedPlayer[];
}

const SavedPlayerSchema = new Schema({
  name: { type: String, default: '' },
  uid: { type: String, default: '' },
  instagram: { type: String, default: '' },
}, { _id: false });

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, default: '' },
  image: { type: String, default: '' },
  provider: { type: String, default: 'google' },
  firstLoginAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: Date.now },
  loginCount: { type: Number, default: 1 },
  isBanned: { type: Boolean, default: false },
  role: { type: String, default: 'user' },
  password: { type: String },
  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null },
  phoneNumber: { type: String, default: '' },
  // Gaming Profile Fields
  teamName: { type: String, default: '' },
  gameUsername: { type: String, default: '' },
  gameUID: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  instagram: { type: String, default: '' },
  paymentQrUrl: { type: String, default: '' },

  savedPlayers: { type: [SavedPlayerSchema], default: [] },
});

// Force schema refresh for new fields
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export const User = mongoose.model<IUser>('User', UserSchema);
