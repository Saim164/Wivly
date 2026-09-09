const router = require("express").Router();
const authMiddleware = require("../middlewares/auth.js");
const upload = require("../middlewares/upload.js");
const { authLimiter } = require("../middlewares/rateLimit.js");
const {
  register,
  login,
  uploadProfilePicture,
  updateProfileData,
  getUserAndProfile,
  getUser,
  getAllUsersProfile,
  getTopUsers,
  downloadResume,
  sendConnectionRequest,
  cancelConnectionRequest,
  respondConnectionRequest,
  getReceivedRequests,
  getMyConnections,
  getConnectionStatus,
} = require("../controllers/user.controllers");

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

router.get("/get-all-users-profile", getAllUsersProfile);
router.get("/get-user", getUser);
router.get("/download-resume", downloadResume);

router.get("/get-user-and-profile", authMiddleware, getUserAndProfile);
router.get("/top-users", authMiddleware, getTopUsers);
router.post("/update-profile-data", authMiddleware, updateProfileData);
router.post(
  "/upload-profile-picture",
  authMiddleware,
  upload.single("profile_picture"),
  uploadProfilePicture,
);

router.post("/send-connection-request", authMiddleware, sendConnectionRequest);
router.post(
  "/cancel-connection-request",
  authMiddleware,
  cancelConnectionRequest,
);
router.post(
  "/respond-connection-request",
  authMiddleware,
  respondConnectionRequest,
);
router.get("/received-requests", authMiddleware, getReceivedRequests);
router.get("/my-connections", authMiddleware, getMyConnections);
router.get("/connection-status", authMiddleware, getConnectionStatus);

module.exports = router;
