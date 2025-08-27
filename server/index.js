import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connect.js";
import postRoutes from "./routes/postRoutes.js";
import dalleRoutes from "./routes/dalleRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // Import the new auth routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// CORS setup
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"], // Added PATCH and DELETE
    allowedHeaders: ["Content-Type", "Authorization"], // Added Authorization header
    credentials: true,
  })
);

app.options("*", cors());
app.use(express.json({ limit: "50mb" }));

// API Routes
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/dalle", dalleRoutes);
app.use("/api/v1/auth", authRoutes); // Use the new auth routes

// Root route for health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from the AI Image Gallery backend!" });
});

// Start server logic
const startServer = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await connectDB(process.env.MONGODB_URL); // Pass the connection string
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
  }
};

startServer();
