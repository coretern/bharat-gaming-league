import mongoose, { Schema, model, models } from 'mongoose';

const RegistrationSchema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userImage: { type: String },
  tournamentId: { type: String, required: true },
  tournamentName: { type: String, required: true },
  matchType: { type: String, enum: ['Solo', 'Duo', 'Squad'], default: 'Solo' },
  teamName: { type: String, required: true },
  whatsapp: { type: String, required: true },
  instagram: { type: String },
  players: [{
    name: { type: String },
    uid: { type: String },
    profileScreenshot: { type: String },
    instagram: { type: String }
  }],
  payoutDetails: {
    bankName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    accountHolder: { type: String },
    qrCodeUrl: { type: String }
  },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  orderId: { type: String },
  paymentVerified: { type: Boolean, default: false },
  rejectionReason: { type: String },
  previousRejectionReason: { type: String },
  isResubmitted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Registration = models.Registration || model('Registration', RegistrationSchema);
