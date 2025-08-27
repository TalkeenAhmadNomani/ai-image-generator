import { v2 as cloudinary } from "cloudinary";
import Post from "../mongodb/models/post.js";

// =============================
// Cloudinary Config
// =============================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =============================
// @desc    Get all posts
// @route   GET /api/posts
// =============================
export const getAllPosts = async (req, res) => {
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
};

// =============================
// @desc    Get single post by ID
// @route   GET /api/posts/:id
// =============================
export const getPostById = async (req, res) => {
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
};

// =============================
// @desc    Create new post
// @route   POST /api/posts
// =============================
export const createPost = async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;

    if (!name || !prompt || !photo) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

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
};

// =============================
// @desc    Update post
// @route   PUT /api/posts/:id
// =============================
export const updatePost = async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;

    let updateData = { name, prompt };

    if (photo) {
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
};

// =============================
// @desc    Delete post
// @route   DELETE /api/posts/:id
// =============================
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

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
};
