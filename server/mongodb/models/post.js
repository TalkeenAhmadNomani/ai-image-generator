import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  name: { type: String, required: true },
  prompt: { type: String, required: true },
  photo: { type: String, required: true },
  cloudinary_id: { type: String }, // optional, for managing deletions
});

const Post = mongoose.model("Post", PostSchema);

export default Post;
