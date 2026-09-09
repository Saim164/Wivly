const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    body: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    media: {
      type: String,
      default: "",
    },
    fileType: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
