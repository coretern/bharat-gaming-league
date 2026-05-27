import mongoose, { Schema, Document } from 'mongoose';

export interface IOTPVerification extends Document {
  email: string;
  password?: string; // Hashed password
  otp: string;
  expiresAt: Date;
  phoneNumber?: string;
}

const OTPVerificationSchema = new Schema<IOTPVerification>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  phoneNumber: { type: String },
});

// Force schema refresh for new fields during Next.js Hot Reloading
if (mongoose.models.OTPVerification) {
  delete mongoose.models.OTPVerification;
}

export const OTPVerification = mongoose.model<IOTPVerification>('OTPVerification', OTPVerificationSchema);
