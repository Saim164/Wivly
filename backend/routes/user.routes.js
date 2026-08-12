const router = require("express").Router();
const {
  register,
  login,
  uploadProfilePicture,
  updateUserProfile,
  updateProfileData,
  getUserAndProfile,
  getAllUsersProfile,
  downloadProfile,
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
  .route("/upload-profile-picture")
  .post(authMiddleware, upload.single("profile_picture"), uploadProfilePicture);
router.route("/user-update").post(authMiddleware, updateUserProfile);
router.route("/update-profile-data").post(authMiddleware, updateProfileData);
router.route("/get-user-and-profile").get(authMiddleware, getUserAndProfile);
router.route("/get-all-users-profile").get(getAllUsersProfile);
router.route("/download-resume").get(downloadProfile);

module.exports = router;
