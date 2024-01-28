// your-project-name/src/config/db.ts

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {});
    console.log("MongoDB Connected...");
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      // Exit process with failure
      process.exit(1);
    }
  }
};

export default connectDB;
