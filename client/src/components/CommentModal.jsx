import React, { useState, useEffect } from "react";
import * as api from "../api";
import { useAuth } from "../context/AuthContext";
import { Loader } from "./";

const CommentModal = ({ postId, onClose }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch comments when the modal opens
  useEffect(() => {
    const fetchComments = async () => {
      try {
        // This is a new API call we will need to create
        const { data } = await api.fetchCommentsForPost(postId);
        setComments(data);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data } = await api.addComment(postId, { text: newComment });
      setComments([...comments, data.data]); // Add new comment to the list
      setNewComment(""); // Clear the input
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Failed to add comment.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose} // Close modal on overlay click
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h3 className="text-xl font-bold mb-4">Comments</h3>
        <div className="overflow-y-auto flex-grow mb-4 pr-2">
          {loading ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="border-b py-2">
                <p className="font-semibold text-gray-800">
                  {comment.author?.username || "Anonymous"}
                </p>
                <p className="text-gray-600">{comment.text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
        {user && (
          <form onSubmit={handleSubmitComment}>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#6469ff] focus:border-[#6469ff]"
              rows="3"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              type="submit"
              className="mt-2 w-full text-white bg-[#6469ff] font-medium rounded-md text-sm px-5 py-2.5 text-center"
            >
              Post Comment
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CommentModal;
