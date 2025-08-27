
import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  // The user's name associated with the post.
  name: { type: String, required: true },

  // The AI prompt used to generate the image.
  prompt: { type: String, required: true },

  // The URL of the generated image.
  photo: { type: String, required: true },

  // This is the crucial link back to the user who created the post.
  // It stores the User's unique _id.
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // An array to store the unique _id of every user who has liked the post.
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  // An array to store the unique _id of every comment on the post.
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  cloudinary_id: { type: String }, 
});

const Post = mongoose.model("Post", PostSchema);

export default Post;
