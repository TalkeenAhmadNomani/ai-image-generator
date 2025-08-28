import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    prompt: { type: String, required: true },
    // Store the secure URL from Cloudinary
    photo: { type: String, required: true },
    // Store the public_id from Cloudinary to manage deletions
    cloudinaryPublicId: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
); // Add timestamps for sorting by recent

const Post = mongoose.model("Post", PostSchema);

export default Post;
