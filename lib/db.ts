import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

declare global {
  var mongoose: { conn: typeof import('mongoose') | null; promise: Promise<typeof import('mongoose')> | null };
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const MONGOOSE_OPTS = {
  serverSelectionTimeoutMS: 10000, // 10s timeout for server selection
  socketTimeoutMS: 45000,          // 45s socket timeout
};

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, MONGOOSE_OPTS).then((m) => m);
  }
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Clear the cached promise so the next call can retry
    cached.promise = null;
    throw err;
  }
  return cached.conn;
}
