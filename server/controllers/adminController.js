import Post from "../mongodb/models/post.js";
import User from "../mongodb/models/user.js";
import Comment from "../mongodb/models/comment.js";

// --- GET GENERAL STATS ---
export const getStats = async (req, res, next) => {
  try {
    const totalPosts = await Post.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalComments = await Comment.countDocuments();

    const topCreator = await User.aggregate([
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "author",
          as: "posts",
        },
      },
      {
        $project: {
          username: 1,
          postCount: { $size: "$posts" },
        },
      },
      { $sort: { postCount: -1 } },
      { $limit: 1 },
    ]);

    res.status(200).json({
      totalPosts,
      totalUsers,
      totalComments,
      topCreator: topCreator.length > 0 ? topCreator[0] : null,
    });
  } catch (error) {
    next(error);
  }
};

// --- NEW: GET TOP 5 MOST LIKED POSTS ---
export const getMostLikedPosts = async (req, res, next) => {
  try {
    const mostLikedPosts = await Post.aggregate([
      {
        $project: {
          prompt: 1,
          photo: 1,
          author: 1,
          likeCount: { $size: "$likes" }, // Calculate the size of the likes array
        },
      },
      { $sort: { likeCount: -1 } }, // Sort by the new likeCount field, descending
      { $limit: 5 }, // Limit to the top 5
      {
        $lookup: {
          // Join with the users collection to get author details
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      { $unwind: "$authorDetails" }, // Deconstruct the authorDetails array
    ]);
    res.status(200).json(mostLikedPosts);
  } catch (error) {
    next(error);
  }
};

// --- NEW: GET TOP 5 MOST COMMENTED POSTS ---
export const getMostCommentedPosts = async (req, res, next) => {
  try {
    const mostCommentedPosts = await Post.aggregate([
      {
        $project: {
          prompt: 1,
          photo: 1,
          author: 1,
          commentCount: { $size: "$comments" },
        },
      },
      { $sort: { commentCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      { $unwind: "$authorDetails" },
    ]);
    res.status(200).json(mostCommentedPosts);
  } catch (error) {
    next(error);
  }
};

// --- NEW: GET POST CREATION STATS FOR CHART ---
export const getPostStatsForChart = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Include today + 6 past days
    sevenDaysAgo.setHours(0, 0, 0, 0); // Set to the beginning of the day

    const postStats = await Post.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }, // Filter for posts created in the last 7 days
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Group by date
          count: { $sum: 1 }, // Count posts per day
        },
      },
      { $sort: { _id: 1 } }, // Sort by date ascending
    ]);

    // Format data for Chart.js to ensure all 7 days are present
    const statsMap = new Map(postStats.map((s) => [s._id, s.count]));
    const labels = [];
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split("T")[0];
      labels.push(dateString);
      data.push(statsMap.get(dateString) || 0);
    }

    res.status(200).json({ labels, data });
  } catch (error) {
    next(error);
  }
};
