import express from "express";
import {
  getAllPosts,
  createPost,
  deletePost,
  likePost,
  getPostById,
} from "../controllers/postController.js";
import {
  addComment,
  getCommentsForPost,
  
} from "../controllers/commentController.js"; // Import getCommentsForPost
import auth from "../middleware/auth.js";

const router = express.Router();

// --- GET ROUTES ---
router.get("/", getAllPosts);
router.get("/:id/comments", getCommentsForPost); // New route to fetch comments for a post
router.get("/:id", getPostById);

// --- PROTECTED POST/PATCH/DELETE ROUTES ---
router.post("/", auth, createPost);
router.delete("/:id", auth, deletePost);
router.patch("/:id/like", auth, likePost);
router.post("/:id/comment", auth, addComment);

export default router;
