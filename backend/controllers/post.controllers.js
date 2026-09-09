const Post = require("../models/post.model.js");
const Comment = require("../models/comment.model.js");
const { uploadToCloudinary } = require("../config/cloudinary.js");

const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "Active" });
};

const createPost = async (req, res) => {
  const user = req.user;
  const { body } = req.body;

  try {
    let media = "";
    let fileType = "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      media = result.secure_url;
      fileType = req.file.mimetype.split("/")[1];
    }

    const post = new Post({
      userId: user._id,
      body,
      media,
      fileType,
    });

    await post.save();

    return res.status(200).json({ message: "Post created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name username email profilePicture");

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  const user = req.user;
  const { post_id } = req.body;

  try {
    const post = await Post.findById(post_id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Not your post" });
    }

    await Post.findByIdAndDelete(post_id);

    return res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const toggleLike = async (req, res) => {
  const user = req.user;
  const { post_id } = req.body;

  try {
    const post = await Post.findById(post_id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.likes.includes(user._id)) {
      post.likes.pull(user._id);
    } else {
      post.likes.push(user._id);
    }

    await post.save();

    return res.status(200).json({ post_id, likes: post.likes });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const commentPost = async (req, res) => {
  const user = req.user;
  const { post_id, commentBody } = req.body;

  try {
    const post = await Post.findById(post_id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = new Comment({
      userId: user._id,
      postId: post_id,
      body: commentBody,
    });

    await comment.save();

    return res.status(200).json({ message: "Comment added" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCommentsByPost = async (req, res) => {
  const { post_id } = req.query;

  try {
    const post = await Post.findById(post_id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.find({ postId: post_id })
      .sort({ createdAt: 1 })
      .populate("userId", "name username profilePicture");

    return res.status(200).json({ comments });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  const user = req.user;
  const { comment_id } = req.body;

  try {
    const comment = await Comment.findById(comment_id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Not your comment" });
    }

    await Comment.findByIdAndDelete(comment_id);

    return res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  activeCheck,
  createPost,
  getAllPosts,
  deletePost,
  toggleLike,
  commentPost,
  getCommentsByPost,
  deleteComment,
};
