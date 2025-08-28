import Comment from "../mongodb/models/comment.js";
import Post from "../mongodb/models/post.js";

// --- Get All Comments for a Post ---
export const getCommentsForPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comments = await Comment.find({ post: id }).populate(
      "author",
      "username"
    );
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

// --- Add a Comment (Refactored for Robustness) ---
export const addComment = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const { text } = req.body;
    const authorId = req.userId;

    if (!authorId) {
      res.status(401);
      throw new Error("You must be logged in to comment.");
    }

    // 1. Create and save the new comment document first.
    const newComment = new Comment({
      text,
      author: authorId,
      post: postId,
    });
    await newComment.save();

    // 2. Use an atomic '$push' operation to add the comment's ID to the post.
    // This is more efficient and avoids the validation error by not re-saving the whole post.
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });

    // 3. Populate the author's username before sending the new comment back.
    const populatedComment = await Comment.findById(newComment._id).populate(
      "author",
      "username"
    );

    res
      .status(201)
      .json({ message: "Comment added successfully", data: populatedComment });
  } catch (error) {
    next(error);
  }
};
