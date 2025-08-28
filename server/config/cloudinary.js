import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";

// Ensure environment variables are loaded right here, before they are used.
dotenv.config();

// Log the variables to the console to confirm they are being loaded.
console.log("Cloudinary Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log(
  "Cloudinary API Key:",
  process.env.CLOUDINARY_API_KEY ? "Loaded" : "Not Loaded"
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
