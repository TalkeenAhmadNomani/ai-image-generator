import React, { useState, useEffect } from "react";
import { Loader } from "../components";
import * as api from "../api"; // You will need to add the admin API calls

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.getAdminStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );
  if (!stats)
    return (
      <h2 className="text-center font-bold text-xl">
        Could not load dashboard data.
      </h2>
    );

  return (
    <section className="max-w-7xl mx-auto">
      <h1 className="font-extrabold text-[#222328] text-[32px]">
        Admin Dashboard
      </h1>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} />
        <StatCard title="Total Posts" value={stats.totalPosts} />
        <StatCard title="Posts in Last 24h" value={stats.postsLast24h} />
      </div>
      <div className="mt-12">
        <h2 className="font-bold text-xl text-[#222328]">Top Creators</h2>
        <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
          <ul>
            {stats.topCreators.map((creator, index) => (
              <li key={index} className="flex justify-between py-2 border-b">
                <span className="font-semibold">{creator.username}</span>
                <span>{creator.count} posts</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
