// --- server/routes/adminRoutes.js ---
import express from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/adminMiddleware.js";
import { getDashboardStats } from "../controllers/adminController.js";

const router = express.Router();

// All routes in this file are protected by auth and admin middleware
router.get("/stats", auth, admin, getDashboardStats);

export default router;
