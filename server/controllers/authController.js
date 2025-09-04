import User from "../mongodb/models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// --- User Signup ---
// Purpose: To create a new user account.
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    // 2. Hash the password for security
    // We never store plain text passwords. bcrypt creates a secure hash.
    const hashedPassword = await bcrypt.hash(password, 12);
    // THIS IS THE KEY PART
    let role = "user";
    if (email === "admin@gmail.com") {
      role = "admin";
    }

    // 3. Create the new user in the database
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role, // The assigned role is saved here
      credits: 100, // Assign initial credits
    });

    // 4. Send a success response
    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong during signup." });
  }
};

// --- User Login ---
// Purpose: To verify a user's credentials and log them in.
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by their email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist." });
    }

    // 2. Compare the submitted password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // 3. Create a JSON Web Token (JWT) for session management
    // This token is like a temporary ID card the user shows to prove they're logged in.
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 4. Send back the token and user info
    res.status(200).json({
      result: {
        _id: user._id,
        username: user.username,
        credits: user.credits,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong during login." });
  }
};
