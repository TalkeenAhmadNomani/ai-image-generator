import Post from "../mongodb/models/post.js";
import Comment from '../mongodb/models/comment.js'; // Import the Comment model
import cloudinary from '../config/cloudinary.js'; // Import the Cloudinary config

// Get posts with pagination
const getPosts = async (page, limit) => {
  const skip = (page - 1) * limit;
  const posts = await Post.find({})
    .populate("author", "username")
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);

  const totalPosts = await Post.countDocuments();
  const totalPages = Math.ceil(totalPosts / limit);

  return { posts, totalPages, currentPage: page };
};

// Create a new post
const createPost = async (postData, userId) => {
  const newPost = await Post.create({
    ...postData,
    author: userId,
  });
  return newPost;
};

// --- Delete a post and all its associated data ---
const deletePostById = async (postId) => {
    // First, find the post to get its Cloudinary public ID
    const post = await Post.findById(postId);
    if (!post) {
        // If the post doesn't exist, we can't proceed.
        throw new Error('Post not found');
    }

    // 1. Delete the image from Cloudinary using its public ID
    if (post.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(post.cloudinaryPublicId);
    }

    // 2. Delete all comments from the 'comments' collection where the 'post' field matches the postId
    await Comment.deleteMany({ post: postId });

    // 3. Finally, delete the post document itself
    await Post.findByIdAndDelete(postId);

    return { message: "Post, associated comments, and image deleted successfully." };
};


// Find a post by its ID
const findPostById = async (postId) => {
  return await Post.findById(postId);
};

// Like or unlike a post
const toggleLikePost = async (post, userId) => {
  const index = post.likes.findIndex((id) => id.toString() === String(userId));
  if (index === -1) {
    post.likes.push(userId);
  } else {
    post.likes = post.likes.filter((id) => id.toString() !== String(userId));
  }
  return await post.save();
};

export const postService = {
  getPosts,
  createPost,
  deletePostById,
  findPostById,
  toggleLikePost,
};
