import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: { type: String, unique: true, sparse: true },
  password: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  refreshToken: { type: String }
});

const User = mongoose.model("User", userSchema);

export default User;
