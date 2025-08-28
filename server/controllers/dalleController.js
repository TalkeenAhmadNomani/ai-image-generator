import User from "../mongodb/models/user.js";
import cloudinary from "../config/cloudinary.js";
import * as dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

// --- Configure OpenAI ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getDalleMessage = (req, res) => {
  res.status(200).json({ message: "Hello from DALL·E!" });
};

export const generateImage = async (req, res, next) => {
  const { prompt } = req.body;
  const userId = req.userId;
  const IMAGE_COST = 20;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (user.credits < IMAGE_COST) {
      res.status(402); // Payment Required
      throw new Error("Insufficient credits. Please purchase more.");
    }

    // --- DALL-E Image Generation (Replaced Placeholder) ---
    const aiResponse = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const imageB64 = aiResponse.data[0].b64_json;

    // --- Upload to Cloudinary ---
    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${imageB64}`,
      {
        folder: "ai_gallery",
        resource_type: "image",
      }
    );

    // --- Deduct Credits ---
    user.credits -= IMAGE_COST;
    await user.save();

    res.status(200).json({
      photo: result.secure_url,
      cloudinaryPublicId: result.public_id,
      credits: user.credits,
    });
  } catch (error) {
    // --- Improved Error Logging ---
    console.error(
      "GENERATE IMAGE ERROR:",
      error.response ? error.response.data : error
    );
    next(error);
  }
};
