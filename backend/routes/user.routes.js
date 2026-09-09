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
  sendConnectionRequest,
  getMyConnectionsRequests,
  whatAreMyConnectionRequests,
  acceptConnectionRequest,
  cancelConnectionRequest,
  getConnectionStatus,
  getMyConnections,
  getUser,
} = require("../controllers/user.controllers");
const authMiddleware = require("../middlewares/auth.js");
const upload = require("../middlewares/upload.js");

router.route("/register").post(register);
router.route("/login").post(login);
router
  .route("/upload-profile-picture")
  .post(authMiddleware, upload.single("profile_picture"), uploadProfilePicture);
router.route("/user-update").post(authMiddleware, updateUserProfile);
router.route("/update-profile-data").post(authMiddleware, updateProfileData);
router.route("/get-user-and-profile").get(authMiddleware, getUserAndProfile);
router.route("/get-all-users-profile").get(getAllUsersProfile);
router.route("/get-user").get(getUser);
router.route("/download-resume").get(downloadProfile);
router
  .route("/send-connection-request")
  .post(authMiddleware, sendConnectionRequest);
router
  .route("/get-my-connection-requests")
  .get(authMiddleware, getMyConnectionsRequests);
router
  .route("/what-are-my-connections")
  .get(authMiddleware, whatAreMyConnectionRequests);
router
  .route("/accept-connection-request")
  .post(authMiddleware, acceptConnectionRequest);
router
  .route("/cancel-connection-request")
  .post(authMiddleware, cancelConnectionRequest);
router.route("/connection-status").get(authMiddleware, getConnectionStatus);
router.route("/my-connections").get(authMiddleware, getMyConnections);

module.exports = router;
