/* Connect mongodb to interact with database */

import mongoose from "mongoose";

if (!process.env.DATABASE_URL) {
  throw new Error('Please add the database url in .env file');
}

const DATABASE_URL: string = process.env.DATABASE_URL;

let globalWithMongoose = global as typeof globalThis & {
  mongoose: any;
};

let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.conn) {
    const options = {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    
    cached.promise = mongoose
      .connect(DATABASE_URL, options)
      .then(() => {
        console.log('Database is already connect');
        return mongoose;
      })
      .catch((error) => 
        console.log(error as Error)
      );
  }

  cached.conn = await cached.promise;

  return cached.conn
}

export default connectDB;
