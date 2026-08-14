const Post = require("../models/post.model.js");

const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "Active" });
};

const createPost = async (req, res) => {
  const user = req.user;
  const { body } = req.body;
  try {
    const post = new Post({
      userId: user._id,
      body: body,
      media: req.file !== undefined ? req.file.filename : "",
      fileType: req.file !== undefined ? req.file.mimetype.split("/")[1] : "",
    });

    await post.save();

    return res.status(200).json({ message: "Post created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  activeCheck,
  createPost
};
