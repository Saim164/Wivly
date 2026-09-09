const router = require("express").Router();
const authMiddleware = require("../middlewares/auth.js");
const upload = require("../middlewares/upload.js");
const {
  activeCheck,
  createPost,
  getAllPosts,
  deletePost,
  commentPost,
  getCommentsByPost,
  deleteComment,
  toggleLike,
} = require("../controllers/post.controllers");

router.route("/").get(activeCheck);
router
  .route("/create-post")
  .post(authMiddleware, upload.single("media"), createPost);
router.route("/get-all-posts").get(getAllPosts);
router.route("/delete-post").delete(authMiddleware, deletePost);
router.route("/comment-post").post(authMiddleware, commentPost);
router.route("/get-comments-by-post").get(getCommentsByPost);
router.route("/delete-comment").delete(authMiddleware, deleteComment);
router.route("/toggle-like").post(authMiddleware, toggleLike);

module.exports = router;
