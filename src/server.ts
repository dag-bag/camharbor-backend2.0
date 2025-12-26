import app from './app';
import connectDB from './config/database';
import dotenv from 'dotenv';
import path from 'path';

// 1. Try default loading (process.cwd)
dotenv.config();

// 2. Fallback: try locating .env file relative to this file
// Works for both src/server.ts and dist/server.js provided they are 1 level deep
if (!process.env.MONGODB_URI) {
  const envPath = path.resolve(__dirname, '../.env');
  console.log(`[Config] Default .env loading failed. Attempting to load from: ${envPath}`);
  dotenv.config({ path: envPath });
}

console.log(`[Config] Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`[Config] MONGODB_URI loaded: ${!!process.env.MONGODB_URI}`);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
