import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  score: {
    correct: {
      type: Number,
      default: 0,
    },
    incorrect: {
      type: Number,
      default: 0,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
userSchema.index({ username: 1 });
userSchema.index({ "score.correct": -1 });
userSchema.index({ createdAt: -1 });


const User = mongoose.model("User", userSchema);

export default User;
