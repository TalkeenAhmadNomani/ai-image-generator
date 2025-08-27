import express from "express";
import { signup, login } from "../controllers/authController.js";

// Initialize a new router instance from Express
const router = express.Router();

// --- Define Authentication Routes ---

// Route for user signup
// When a POST request is made to '/signup', the 'signup' controller function is executed.
router.post("/signup", signup);

// Route for user login
// When a POST request is made to '/login', the 'login' controller function is executed.
router.post("/login", login);

// Export the router to be used in the main index.js file
export default router;
