import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4]">
      <Link to="/" className="font-extrabold text-2xl text-[#6469ff]">
        AI-Gallery
      </Link>

      <div className="flex items-center gap-4">
        {user?.result ? (
          <>
            {/* Credits Display */}
            <div className="font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-md">
              Credits: {user.result.credits}
            </div>

            {/* My Profile Link */}
            <Link
              to={`/profile/${user.result._id}`}
              className="font-inter font-medium text-gray-700 hover:text-[#6469ff]"
            >
              My Profile
            </Link>

            <Link
              to="/create-post"
              className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md"
            >
              Create
            </Link>
            <button
              onClick={logout}
              className="font-inter font-medium bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="font-inter font-medium text-gray-700 hover:text-[#6469ff]"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
