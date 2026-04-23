import mongoose, { Schema, model, models } from 'mongoose';

const RegistrationSchema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userImage: { type: String },
  tournamentId: { type: String, required: true },
  tournamentName: { type: String, required: true },
  game: { type: String, enum: ['BGMI', 'Free Fire'] },
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
    qrCodeUrl: { type: String }
  },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  orderId: { type: String },
  paymentVerified: { type: Boolean, default: false },
   rejectionReason: { type: String },
   rejectionTargets: [String],
   rejectionIndices: [Number],
   previousRejectionReason: { type: String },
  isResubmitted: { type: Boolean, default: false },
  groupNumber: { type: Number },
  slotNumber: { type: Number },
  resultStatus: { type: String, enum: ['Playing', 'Won', 'Lost'], default: 'Playing' },
  prizeAmount: { type: Number, default: 0 },
  winnerTeamName: { type: String },
  matchDate: { type: String },
  matchTime: { type: String },
  winnerScreenshot: { type: String },
  roomId: { type: String, default: '' },
  roomPassword: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

// Force schema update in development (ensures new fields are picked up)
if (mongoose.models.Registration) {
  delete mongoose.models.Registration;
}

export const Registration = model('Registration', RegistrationSchema);
