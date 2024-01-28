import connectDB from "./config/db";
import { v2 as cloudinary } from "cloudinary";

import { config } from "dotenv";
config(); // Invoking dotenv config at the top
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
import app from "./app";
import http from "http";

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
connectDB().then(async () => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
  });
});
