import mongoose from "mongoose";
import { green } from "console-log-colors";

const MONGODB_URI = process.env.MONGODB_URI;

// Connect to the MongoDB database
const connectDB = async () => {
  const connectioState = mongoose.connection.readyState;

  if (connectioState === 1) {
    console.log("Database is already connected");
    return;
  }

  if (connectioState === 2) {
    console.log("Database is connecting");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI!, {
      // - CREATE THE DATABASE NAME HERE! (next-mongo-template-DB)
      dbName: process.env.DATABASE_NAME,
      bufferCommands: false,
    });

    console.log(green("Database connected successfully"));
  } catch (error) {
    console.error("Database connection error", error);

    throw new Error(
      "Database connection error, check the db connection file: db.ts"
    );
  }
};

// Export the connectDB function
export default connectDB;
