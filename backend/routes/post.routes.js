const router = require("express").Router();
const authMiddleware = require("../middlewares/auth.js");
const upload = require("../middlewares/upload.js");
const {
  activeCheck,
  createPost,
  getAllPosts,
  deletePost,
  toggleLike,
  commentPost,
  getCommentsByPost,
  deleteComment,
} = require("../controllers/post.controllers");

router.get("/", activeCheck);

router.get("/get-all-posts", getAllPosts);
router.get("/get-comments-by-post", getCommentsByPost);

router.post("/create-post", authMiddleware, upload.single("media"), createPost);
router.delete("/delete-post", authMiddleware, deletePost);
router.post("/toggle-like", authMiddleware, toggleLike);
router.post("/comment-post", authMiddleware, commentPost);
router.delete("/delete-comment", authMiddleware, deleteComment);

module.exports = router;
