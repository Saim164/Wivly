const router = require("express").Router();
const authMiddleware = require("../middlewares/auth.js");
const multer = require("multer");
const {
  activeCheck,
  createPost,
  getAllPosts,
  deletePost,
} = require("../controllers/post.controllers");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.route("/").get(activeCheck);
router
  .route("/create-post")
  .post(authMiddleware, upload.single("media"), createPost);
router.route("/get-all-posts").get(getAllPosts);
router.route("/delete-post").delete(authMiddleware, deletePost);

module.exports = router;
