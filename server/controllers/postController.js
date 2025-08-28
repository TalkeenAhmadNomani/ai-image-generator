import { postService } from "../services/postService.js";
import mongoose from "mongoose";

// Get all posts with pagination
export const getAllPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12; // 12 posts per page
    const data = await postService.getPosts(page, limit);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error); // Pass error to the centralized error handler
  }
};

// Create a new post
export const createPost = async (req, res, next) => {
  try {
    const postData = req.body;
    const userId = req.userId;
    const newPost = await postService.createPost(postData, userId);
    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    next(error);
  }
};

// Delete a post
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("Post not found");
    }

    const post = await postService.findPostById(id);
    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    if (post.author.toString() !== userId) {
      res.status(403);
      throw new Error("User not authorized to delete this post");
    }

    await postService.deletePostById(id);
    res.json({ message: "Post deleted successfully." });
  } catch (error) {
    next(error);
  }
};

// Like a post
export const likePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("Post not found");
    }

    const post = await postService.findPostById(id);
    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    const updatedPost = await postService.toggleLikePost(post, userId);
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
// --- Get a Single Post by ID (New Function) ---
export const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("Post not found");
    }

    // You will need to add a findPostById function to your postService
    const post = await postService.findPostById(id);

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    // Populate author details and also populate the comments with their author's username
    await post.populate([
      { path: "author", select: "username" },
      {
        path: "comments",
        populate: {
          path: "author",
          select: "username",
        },
      },
    ]);

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};
