const Post = require("../models/post.model.js");
// const Comment = require("../models/comment.model.js");

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

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "userId",
      "name username email profilePicture",
    );

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

    return res.json({ message: "Post deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// const commentPost = async (req, res) => {
//   const user = req.user;
//   const { post_id, commentBody } = req.body;
//   try {
//     const post = await Post.findById(post_id);
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }
//     const comment = new Comment({
//       userId: user._id,
//       postId: post_id,
//       body: commentBody,
//     });

//     await comment.save();
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

module.exports = {
  activeCheck,
  createPost,
  getAllPosts,
  deletePost,
};
