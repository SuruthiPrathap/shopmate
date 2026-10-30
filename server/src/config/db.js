const mongoose = require("mongoose");

// Cache the connection across requests (serverless functions reuse warm instances)
let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shopmate";
    cached.promise = mongoose
      .connect(mongoURI, { bufferCommands: false })
      .then((m) => {
        console.log(`MongoDB Connected: ${m.connection.host}`);
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // allow a retry on the next request
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error; // let server.js return a 500 instead of crashing silently
  }

  return cached.conn;
};

module.exports = connectDB;