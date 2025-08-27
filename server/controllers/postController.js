import Post from "../mongodb/models/post.js";
import mongoose from "mongoose";

// --- Get All Posts ---
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("author", "username")
      .sort({ _id: -1 });
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Fetching posts failed, please try again",
      });
  }
};

// --- Create a Post (Corrected) ---
export const createPost = async (req, res) => {
  try {
    // The 'name' and 'photo' come from the form state.
    // The 'userId' is attached by the auth middleware.
    const { name, prompt, photo } = req.body;
    const userId = req.userId; // Get the user ID from the middleware

    // 1. Check if userId exists (user is logged in)
    if (!userId) {
      return res
        .status(401)
        .json({
          success: false,
          message: "You must be logged in to create a post.",
        });
    }

    // 2. Create the new post, making sure to include the 'author' field
    const newPost = await Post.create({
      name,
      prompt,
      photo,
      author: userId, // Assign the logged-in user's ID to the author field
    });

    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    // Add detailed error logging to the console for easier debugging
    console.error("CREATE POST ERROR:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Unable to create a post, please try again",
      });
  }
};

// --- Delete a Post ---
export const deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).send(`No post with id: ${id}`);

    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post." });
    }

    await Post.findByIdAndDelete(id);
    res.json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error("DELETE POST ERROR:", error);
    res.status(500).json({ message: "Error deleting post." });
  }
};

// --- Like a Post ---
export const likePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  if (!userId) return res.status(401).json({ message: "Unauthenticated" });
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  try {
    const post = await Post.findById(id);
    const index = post.likes.findIndex((id) => id === String(userId));

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(userId));
    }

    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("LIKE POST ERROR:", error);
    res
      .status(500)
      .json({ message: "Something went wrong with liking the post." });
  }
};
