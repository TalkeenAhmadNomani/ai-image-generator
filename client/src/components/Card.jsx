import React, { useState } from "react";
import { Link } from "react-router-dom";
import { download } from "../assets";
import { downloadImage } from "../utils";
import { useAuth } from "../context/AuthContext";
import * as api from "../api";
import CommentModal from "./CommentModal";

const Card = ({
  _id,
  name,
  prompt,
  photo,
  author,
  likes,
  comments,
  onPostUpdate,
}) => {
  const { user } = useAuth();
  const userId = user?.result?._id;
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await api.deletePost(_id);
        onPostUpdate();
      } catch (error) {
        console.error("Failed to delete post:", error);
        alert("Failed to delete post.");
      }
    }
  };

  const handleLike = async () => {
    if (!user) return alert("You must be logged in to like a post.");
    try {
      await api.likePost(_id);
      onPostUpdate();
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  return (
    <>
      <div className="rounded-xl group relative shadow-card hover:shadow-cardhover card">
        <Link to={`/post/${_id}`}>
          <img
            className="w-full h-auto object-cover rounded-xl"
            src={photo}
            alt={prompt}
          />
        </Link>
        <div className="group-hover:flex flex-col max-h-[94.5%] hidden absolute bottom-0 left-0 right-0 bg-[#10131f] m-2 p-4 rounded-md">
          <p className="text-white text-sm overflow-y-auto prompt">{prompt}</p>
          <div className="mt-5 flex justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full object-cover bg-green-700 flex justify-center items-center text-white text-xs font-bold">
                {author?.username?.[0].toUpperCase() || "A"}
              </div>
              <p className="text-white text-sm">
                {author?.username || "Anonymous"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Comment Button */}
              <button
                type="button"
                onClick={() => setIsCommentModalOpen(true)}
                className="outline-none bg-transparent border-none text-white text-xl"
              >
                💬{" "}
                <span className="text-sm align-top">
                  {comments?.length || 0}
                </span>
              </button>
              {/* Like Button */}
              <button
                type="button"
                onClick={handleLike}
                className={`outline-none bg-transparent border-none text-xl ${
                  likes?.includes(userId) ? "text-red-500" : "text-white"
                }`}
              >
                ♥{" "}
                <span className="text-sm align-top">{likes?.length || 0}</span>
              </button>
              {userId === author?._id && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="outline-none bg-red-600 text-white text-xs font-bold py-1 px-2 rounded"
                >
                  DELETE
                </button>
              )}
              <button
                type="button"
                onClick={() => downloadImage(_id, photo)}
                className="outline-none bg-transparent border-none"
              >
                <img
                  src={download}
                  alt="download"
                  className="w-6 h-6 object-contain invert"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Render the modal conditionally */}
      {isCommentModalOpen && (
        <CommentModal
          postId={_id}
          onClose={() => setIsCommentModalOpen(false)}
        />
      )}
    </>
  );
};

export default Card;
