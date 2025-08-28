import express from "express";
import { getUserProfile, getUserPosts } from "../controllers/userController.js";

const router = express.Router();

// Route to get a user's profile
router.get("/:id", getUserProfile);

// Route to get all posts by a user
router.get("/:id/posts", getUserPosts);

export default router;
