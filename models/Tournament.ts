import mongoose, { Schema, model, models } from 'mongoose';

const TournamentSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  game: { type: String, enum: ['BGMI', 'Free Fire'], required: true },
  prizePool: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  slots: { type: String, required: true },
  image: { type: String, required: true },
  status: { type: String, enum: ['Open', 'Closed', 'Coming Soon'], default: 'Open' },
  allowedMatchTypes: { type: [String], default: ['Solo', 'Duo', 'Squad'] },
  createdAt: { type: Date, default: Date.now },
});

// Force schema update in development
if (mongoose.models.Tournament) {
  delete mongoose.models.Tournament;
}

export const Tournament = model('Tournament', TournamentSchema);
