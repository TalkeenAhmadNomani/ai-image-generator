import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet"; // For security headers
import rateLimit from "express-rate-limit"; // For rate limiting

import connectDB from "./mongodb/connect.js";
import postRoutes from "./routes/postRoutes.js";
import dalleRoutes from "./routes/dalleRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"; // Import the new admin routes
import userRoutes from "./routes/userRoutes.js"; // 
import { errorHandler } from "./middleware/errorMiddleware.js"; // Centralized error handler

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// --- Security Middleware ---
app.use(helmet()); // Set security HTTP headers
app.use(cors()); // Enable CORS
app.use(express.json({ limit: "50mb" }));

// --- Rate Limiting ---
// Apply to all API routes to prevent abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", apiLimiter);

// --- API Routes ---
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/dalle", dalleRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes); // Use the new admin routes
app.use("/api/v1/users", userRoutes); // Use the new user routes
// Root route for health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is healthy!" });
});

// --- Centralized Error Handler ---
// This MUST be the last piece of middleware you use
app.use(errorHandler);

// Start server logic
const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(PORT, () =>
      console.log(`🚀 Server running at: http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
  }
};

startServer();
