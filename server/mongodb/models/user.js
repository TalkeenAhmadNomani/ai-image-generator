import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Add role with 'user' as the default value
  role: { type: String, enum: ["user", "admin"], default: "user" },
  // Add credits with a default of 100
  credits: { type: Number, default: 100 },
});

const User = mongoose.model("User", UserSchema);

export default User;
