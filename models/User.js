import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    login: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: String,
    dob: String,
    locate: String,
    company: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
