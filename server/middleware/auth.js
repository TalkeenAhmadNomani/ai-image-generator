import jwt from "jsonwebtoken";

// This is our middleware function
const auth = async (req, res, next) => {
  try {
    // 1. Get the token from the request header.
    // It's usually sent in the format: "Bearer [token]"
    const token = req.headers.authorization.split(" ")[1];

    // 2. Check if the token is our own (not from Google Auth, for example)
    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token && isCustomAuth) {
      // 3. Verify the token using the same secret key from the login controller
      decodedData = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Attach the user's ID to the request object
      // Now, any protected route that comes after this middleware
      // will have access to req.userId
      req.userId = decodedData?.id;
    } else {
      // Handle other auth types if you add them later (e.g., Google OAuth)
    }

    // 5. If everything is okay, call next() to pass the request
    // to the next function in the chain (the actual controller logic).
    next();
  } catch (error) {
    console.log(error);
    // If the token is invalid or expired, this catch block will run.
    res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token." });
  }
};

export default auth;
