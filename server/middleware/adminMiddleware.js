import User from "../mongodb/models/user.js";

const admin = async (req, res, next) => {
  try {
    // req.userId is attached by the preceding 'auth' middleware
    const user = await User.findById(req.userId);

    if (user && user.role === "admin") {
      next();
    } else {
      res.status(403); // Forbidden
      throw new Error("Not authorized as an admin");
    }
  } catch (error) {
    next(error);
  }
};

export default admin;
