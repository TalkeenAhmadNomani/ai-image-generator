import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader, Card } from "../components";
import * as api from "../api"; // You'll need to add the API calls for this

const ProfilePage = () => {
  const { id: userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // You will need to create these two API calls
        const profilePromise = api.fetchUserProfile(userId);
        const postsPromise = api.fetchPostsByUser(userId);

        // Fetch user info and their posts in parallel
        const [profileResponse, postsResponse] = await Promise.all([
          profilePromise,
          postsPromise,
        ]);

        setUserProfile(profileResponse.data);
        setUserPosts(postsResponse.data);
      } catch (error) {
        console.error("Failed to fetch profile data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <h2 className="text-center font-bold text-xl">User profile not found.</h2>
    );
  }

  return (
    <section className="max-w-7xl mx-auto">
      {/* Profile Header */}
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-indigo-600 flex justify-center items-center text-white text-4xl font-bold mb-4">
          {userProfile.username[0].toUpperCase()}
        </div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          {userProfile.username}
        </h1>
        <p className="text-gray-500">{userProfile.email}</p>
        <div className="mt-2 text-lg font-semibold bg-gray-100 px-4 py-1 rounded-full">
          Credits: {userProfile.credits}
        </div>
      </div>

      {/* User's Posts */}
      <div className="mt-16">
        <h2 className="font-bold text-xl text-[#222328] mb-4">
          Creations by {userProfile.username}
        </h2>
        {userPosts.length > 0 ? (
          <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
            {userPosts.map((post) => (
              <Card key={post._id} {...post} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            This user hasn't created any posts yet.
          </p>
        )}
      </div>
    </section>
  );
};

export default ProfilePage;
