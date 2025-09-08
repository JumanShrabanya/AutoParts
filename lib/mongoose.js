import mongoose from "mongoose";
import dotenv from "dotenv";

// Ensure environment variables are loaded when running outside Next.js (e.g., node scripts)
dotenv.config();

const { MONGO_URL } = process.env;
if (!MONGO_URL) {
  throw new Error("MONGO_URL is not set in environment variables");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URL, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => mongooseInstance);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
