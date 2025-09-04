import express from "express";
import {
  getStats,
  getMostLikedPosts,
  getMostCommentedPosts,
  getPostStatsForChart,
} from "../controllers/adminController.js";

const router = express.Router();

// This route provides general stats for the dashboard.
router.get("/stats", getStats);

// --- NEW ROUTES ---
// This route gets the top 5 most liked posts.
router.get("/posts/most-liked", getMostLikedPosts);

// This route gets the top 5 most commented posts.
router.get("/posts/most-commented", getMostCommentedPosts);

// This route provides data formatted for the creation chart.
router.get("/posts/chart-stats", getPostStatsForChart);

export default router;
