// --- server/controllers/adminController.js ---
import User from "../mongodb/models/user.js";
import Post from "../mongodb/models/post.js";

// Get dashboard statistics
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();

    // Posts in the last 24 hours
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const postsLast24h = await Post.countDocuments({
      createdAt: { $gte: last24Hours },
    });

    // Top 5 users by post count
    const topCreators = await Post.aggregate([
      { $group: { _id: "$author", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      { $unwind: "$authorDetails" },
      { $project: { username: "$authorDetails.username", count: 1, _id: 0 } },
    ]);

    res.status(200).json({
      totalUsers,
      totalPosts,
      postsLast24h,
      topCreators,
    });
  } catch (error) {
    next(error);
  }
};
