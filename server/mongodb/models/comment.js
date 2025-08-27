import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  },
  { timestamps: true }
);

// This is the important part: it defines the 'Comment' model
const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
