import mongoose from "mongoose";

declare global {
   var mongoose: Cached | undefined;
}

interface Cached {
   conn: typeof mongoose | null;
   promise: Promise<typeof mongoose> | null;
}

const MONGODB_URI =
   process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce";

if (!MONGODB_URI) {
   throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
   );
}

const cached = (global.mongoose as Cached) || { conn: null, promise: null };

if (!global.mongoose) {
   global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
   if (cached.conn) {
      return cached.conn;
   }

   if (!cached.promise) {
      const opts = {
         bufferCommands: true,
      };

      cached.promise = mongoose.connect(MONGODB_URI, opts);
   }

   try {
      cached.conn = await cached.promise;
      return cached.conn;
   } catch (e) {
      cached.promise = null;
      throw e;
   }
}

export default connectDB;
