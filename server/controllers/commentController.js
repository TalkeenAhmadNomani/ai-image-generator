import Comment from "../mongodb/models/comment.js";
import Post from "../mongodb/models/post.js";

// --- Get All Comments for a Post ---
export const getCommentsForPost = async (req, res) => {
  try {
    const { id } = req.params; // The ID of the post
    // Find all comments that have a 'post' field matching the post's ID
    // Also, populate the 'author' field with their username.
    const comments = await Comment.find({ post: id }).populate(
      "author",
      "username"
    );
    res.status(200).json(comments);
  } catch (error) {
    console.error("GET COMMENTS ERROR:", error);
    res.status(404).json({ message: "Could not fetch comments." });
  }
};

// --- Add a Comment (Corrected) ---
export const addComment = async (req, res) => {
  try {
    const { id: postId } = req.params; // The post being commented on
    const { text } = req.body; // The comment text
    const authorId = req.userId; // Get the user ID from the auth middleware

    // 1. Make sure the user is logged in
    if (!authorId) {
      return res
        .status(401)
        .json({ message: "You must be logged in to comment." });
    }

    // 2. Find the post to make sure it exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 3. Create the new comment document
    const newComment = new Comment({
      text,
      author: authorId,
      post: postId,
    });
    await newComment.save();

    // 4. Add the ID of the new comment to the post's 'comments' array
    post.comments.push(newComment._id);
    await post.save();

    // 5. Populate the author's username before sending back
    const populatedComment = await Comment.findById(newComment._id).populate(
      "author",
      "username"
    );

    // 6. Send back the new comment
    res
      .status(201)
      .json({ message: "Comment added successfully", data: populatedComment });
  } catch (error) {
    console.error("ADD COMMENT ERROR:", error);
    res
      .status(500)
      .json({ message: "Error adding comment", error: error.message });
  }
};
