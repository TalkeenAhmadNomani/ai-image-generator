import User from "../mongodb/models/user.js";
import Post from "../mongodb/models/post.js";
import mongoose from "mongoose";

// Get a user's public profile information
export const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("User not found");
    }
    // Find the user but only select public fields. Never send the password hash.
    const user = await User.findById(id).select("-password");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Get all posts created by a specific user
export const getUserPosts = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("User not found");
    }
    const posts = await Post.find({ author: id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};
