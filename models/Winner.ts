import mongoose, { Schema, Document, models } from 'mongoose';

export interface IWinner extends Document {
  tournamentId: string;
  tournamentName: string;
  teamName: string;
  playerName: string;
  amount: string;
  date: string;
  createdAt: Date;
}

const WinnerSchema = new Schema<IWinner>({
  tournamentId: { type: String, required: true },
  tournamentName: { type: String, required: true },
  teamName: { type: String, required: true },
  playerName: { type: String, required: true },
  amount: { type: String, required: true },
  date: { type: String, required: true }, // Format: "DD Oct YYYY" or similar
  createdAt: { type: Date, default: Date.now },
});

export const Winner = models.Winner || mongoose.model<IWinner>('Winner', WinnerSchema);
