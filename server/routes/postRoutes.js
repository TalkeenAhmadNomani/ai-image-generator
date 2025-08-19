import express from "express";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

import Post from "../mongodb/models/post.js"; // ✅ FIXED (import model, not connect.js)

dotenv.config();

const router = express.Router();

// =============================
// Cloudinary Config
// =============================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =============================
// GET All Posts
// =============================
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ _id: -1 });
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    console.error("❌ Error fetching posts:", err.message);
    res.status(500).json({
      success: false,
      message: "Fetching posts failed, please try again",
    });
  }
});

// =============================
// GET Single Post by ID
// =============================
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    res.status(200).json({ success: true, data: post });
  } catch (err) {
    console.error("❌ Error fetching single post:", err.message);
    res.status(500).json({ success: false, message: "Error fetching post" });
  }
});

// =============================
// POST Create New Post
// =============================
router.post("/", async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;

    if (!name || !prompt || !photo) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // ✅ Upload to Cloudinary
    const photoUrl = await cloudinary.uploader.upload(photo, {
      folder: "ai_images",
      resource_type: "image",
    });

    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl.secure_url,
      cloudinary_id: photoUrl.public_id,
    });

    res.status(201).json({ success: true, data: newPost });
  } catch (err) {
    console.error("❌ Error creating post:", err.message);
    res.status(500).json({
      success: false,
      message: "Unable to create a post, please try again",
    });
  }
});

// =============================
// PUT Update Post
// =============================
router.put("/:id", async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;

    let updateData = { name, prompt };

    if (photo) {
      // Upload new image
      const photoUrl = await cloudinary.uploader.upload(photo, {
        folder: "ai_images",
      });
      updateData.photo = photoUrl.secure_url;
      updateData.cloudinary_id = photoUrl.public_id;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedPost });
  } catch (err) {
    console.error("❌ Error updating post:", err.message);
    res.status(500).json({ success: false, message: "Error updating post" });
  }
});

// =============================
// DELETE Post
// =============================
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    // ✅ Delete from Cloudinary if exists
    if (post.cloudinary_id) {
      await cloudinary.uploader.destroy(post.cloudinary_id);
    }

    await Post.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting post:", err.message);
    res.status(500).json({ success: false, message: "Error deleting post" });
  }
});

export default router;
