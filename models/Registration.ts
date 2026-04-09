import mongoose, { Schema, model, models } from 'mongoose';

const RegistrationSchema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userImage: { type: String },
  tournamentId: { type: String, required: true },
  tournamentName: { type: String, required: true },
  teamName: { type: String, required: true },
  leaderUid: { type: String, required: true },
  whatsapp: { type: String, required: true },
  paymentScreenshot: { type: String }, // Cloudinary URL
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  paymentVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Registration = models.Registration || model('Registration', RegistrationSchema);
