import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader } from "../components";
import { useAuth } from "../context/AuthContext";
import * as api from "../api";

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPost = async () => {
    try {
      const { data } = await api.fetchPostById(id);
      setPost(data);
    } catch (error) {
      console.error("Failed to fetch post", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await api.addComment(id, { text: newComment });
      setNewComment(""); // Clear input field
      fetchPost(); // Re-fetch the post to show the new comment
    } catch (error) {
      console.error("Failed to add comment", error);
      alert("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );
  if (!post)
    return <h2 className="text-center font-bold text-xl">Post not found.</h2>;

  return (
    <section className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img
            src={post.photo}
            alt={post.prompt}
            className="w-full h-auto object-contain rounded-lg shadow-lg"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="font-bold text-2xl">Prompt Details</h1>
          <p className="mt-2 text-gray-700 bg-gray-100 p-4 rounded-md">
            {post.prompt}
          </p>
          <div className="mt-4">
            <p className="text-gray-500">
              Created by:{" "}
              <Link
                to={`/profile/${post.author._id}`}
                className="font-semibold text-indigo-600 hover:underline"
              >
                {post.author.username}
              </Link>
            </p>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <h2 className="font-bold text-xl mb-4">
              Comments ({post.comments.length})
            </h2>
            <div className="flex-grow overflow-y-auto pr-2 space-y-4 mb-4">
              {post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div key={comment._id} className="border-b pb-2">
                    <p className="font-semibold text-gray-800">
                      {comment.author?.username || "Anonymous"}
                    </p>
                    <p className="text-gray-600">{comment.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No comments yet.</p>
              )}
            </div>
            {user && (
              <form onSubmit={handleCommentSubmit} className="mt-auto">
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#6469ff] focus:border-[#6469ff]"
                  rows="3"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 w-full text-white bg-[#6469ff] font-medium rounded-md text-sm px-5 py-2.5 text-center disabled:bg-gray-400"
                >
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostDetail;
