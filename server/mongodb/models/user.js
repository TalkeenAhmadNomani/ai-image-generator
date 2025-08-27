import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  // The user's public name, must be unique.
  username: { type: String, required: true, unique: true },

  // The user's email, also unique, for login and communication.
  email: { type: String, required: true, unique: true },

  // The user's password. In a real app, this should be hashed!
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

export default User;
