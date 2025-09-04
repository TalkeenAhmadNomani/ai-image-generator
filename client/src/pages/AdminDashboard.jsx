import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import * as api from "../api";
import { Loader } from "../components";

// Register Chart.js components we'll be using
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [mostLiked, setMostLiked] = useState([]);
  const [mostCommented, setMostCommented] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch all data in parallel for better performance
        const [statsRes, likedRes, commentedRes, chartRes] = await Promise.all([
          api.getAdminStats(),
          api.getMostLikedPosts(),
          api.getMostCommentedPosts(),
          api.getPostStatsForChart(),
        ]);

        setStats(statsRes.data);
        setMostLiked(likedRes.data);
        setMostCommented(commentedRes.data);

        // Format data for the chart component
        setChartData({
          labels: chartRes.data.labels,
          datasets: [
            {
              label: "Images Created",
              data: chartRes.data.data,
              backgroundColor: "rgba(100, 105, 255, 0.6)",
              borderColor: "rgba(100, 105, 255, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader />
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto">
      <h1 className="font-extrabold text-[#222328] text-[32px]">
        Admin Dashboard
      </h1>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Cards */}
        <StatCard title="Total Users" value={stats?.totalUsers || 0} />
        <StatCard title="Total Images" value={stats?.totalPosts || 0} />
        <StatCard title="Total Comments" value={stats?.totalComments || 0} />
        <StatCard
          title="Top Creator"
          value={stats?.topCreator?.username || "N/A"}
          note={`(${stats?.topCreator?.postCount || 0} posts)`}
        />
      </div>

      {/* Chart Section */}
      <div className="mt-8 bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Images Created (Last 7 Days)
        </h3>
        {chartData ? (
          <Bar
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
            data={chartData}
          />
        ) : (
          <p>Loading chart data...</p>
        )}
      </div>

      {/* Top Posts Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <TopPostList title="Most Liked Posts" posts={mostLiked} type="like" />
        <TopPostList
          title="Most Commented Posts"
          posts={mostCommented}
          type="comment"
        />
      </div>
    </section>
  );
};

// --- Helper Components ---
const StatCard = ({ title, value, note }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
    {note && <p className="text-gray-400 text-xs mt-1">{note}</p>}
  </div>
);

const TopPostList = ({ title, posts, type }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
    {posts.length > 0 ? (
      <ul className="space-y-4">
        {posts.map((post) => (
          <li
            key={post._id}
            className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-md"
          >
            <Link to={`/post/${post._id}`}>
              <img
                src={post.photo}
                alt="post"
                className="w-16 h-16 object-cover rounded-md"
              />
            </Link>
            <div className="flex-1">
              <p className="text-sm text-gray-800 truncate">{post.prompt}</p>
              <p className="text-xs text-gray-500">
                by {post.authorDetails.username}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-[#6469ff]">
                {type === "like" ? post.likeCount : post.commentCount}
              </p>
              <p className="text-xs text-gray-400">
                {type === "like" ? "Likes" : "Comments"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No data available.</p>
    )}
  </div>
);

export default AdminDashboard;
