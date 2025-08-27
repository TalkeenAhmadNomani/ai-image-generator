import express from "express";
import {
  getDalleMessage,
  generateImage,
} from "../controllers/dalleController.js";
import auth from "../middleware/auth.js"; // Import the middleware

const router = express.Router();

// This route can remain public if you want
router.get("/", getDalleMessage);

// This route is now PROTECTED.
// A user must be logged in to generate an image.
router.post("/", auth, generateImage);

export default router;
