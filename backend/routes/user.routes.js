const router = require("express").Router();
const {
  register,
  login,
  uploadProfilePicture,
  updateUserProfile,
  getUserAndProfile,
} = require("../controllers/user.controllers");
const authMiddleware = require("../middlewares/auth.js");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.route("/register").post(register);
router.route("/login").post(login);
router
  .route("/upload_profile_picture")
  .post(authMiddleware, upload.single("profile_picture"), uploadProfilePicture);
router.route("/user-update").post(authMiddleware, updateUserProfile);
router.route("/get_user_and_profile").get(authMiddleware, getUserAndProfile);

module.exports = router;
