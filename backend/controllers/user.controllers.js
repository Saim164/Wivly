const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const Profile = require("../models/profile.model");
const ConnectionRequest = require("../models/connection.model");
const jwt = require("jsonwebtoken");
const PDFDocument = require("pdfkit");
const crypto = require("crypto");
const fs = require("fs");

const convetUserDataToPdf = (userData) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
    const stream = fs.createWriteStream("uploads/" + outputPath);

    doc.pipe(stream);

    const ink = "#201417";
    const brand = "#c2255f";
    const muted = "#6b6b6b";
    const rule = "#e5e0e2";

    const picturePath = `uploads/${userData.userId.profilePicture}`;
    if (fs.existsSync(picturePath)) {
      try {
        doc.image(picturePath, doc.page.width - 110, 50, {
          width: 60,
          height: 60,
        });
      } catch (e) {
        // ignore unreadable image
      }
    }

    doc.fillColor(ink).fontSize(24).text(userData.userId.name);
    doc.moveDown(0.2);
    doc.fillColor(brand).fontSize(12).text(`@${userData.userId.username}`);
    if (userData.currentPost) {
      doc.fillColor(ink).fontSize(12).text(userData.currentPost);
    }
    doc.fillColor(muted).fontSize(10).text(userData.userId.email);

    doc.moveDown(0.8);
    doc
      .strokeColor(rule)
      .lineWidth(1)
      .moveTo(doc.x, doc.y)
      .lineTo(doc.page.width - 50, doc.y)
      .stroke();

    const section = (title) => {
      doc.moveDown(0.9);
      doc.fillColor(brand).fontSize(12).text(title.toUpperCase());
      doc.moveDown(0.4);
    };

    if (userData.bio) {
      section("About");
      doc.fillColor(ink).fontSize(11).text(userData.bio);
    }

    if (userData.pastWork && userData.pastWork.length > 0) {
      section("Experience");
      userData.pastWork.forEach((work) => {
        const heading = work.company
          ? `${work.position} · ${work.company}`
          : work.position;
        doc.fillColor(ink).fontSize(11).text(heading);
        if (work.years) {
          doc.fillColor(muted).fontSize(10).text(work.years);
        }
        doc.moveDown(0.5);
      });
    }

    if (userData.education && userData.education.length > 0) {
      section("Education");
      userData.education.forEach((edu) => {
        doc.fillColor(ink).fontSize(11).text(edu.school);
        const detail = [edu.degree, edu.fieldOfStudy]
          .filter(Boolean)
          .join(", ");
        if (detail) {
          doc.fillColor(muted).fontSize(10).text(detail);
        }
        doc.moveDown(0.5);
      });
    }

    doc.end();

    stream.on("finish", () => resolve(outputPath));
    stream.on("error", reject);
  });
};

const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const profile = new Profile({
      userId: newUser._id,
    });
    await profile.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return res.status(200).json({ token: token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    const user = req.user;
    user.profilePicture = req.file.filename;
    await user.save();

    return res
      .status(200)
      .json({ message: "Profile picture uploaded successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = req.user;
    const { username, email } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser && String(existingUser._id) !== String(user._id)) {
      return res
        .status(400)
        .json({ message: "Username or email already taken" });
    }

    user.username = username;
    user.email = email;

    await user.save();
    return res.json({ message: "User updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateProfileData = async (req, res) => {
  try {
    const user = req.user;
    const profile = await Profile.findOne({ userId: user._id });
    const { bio, currentPost, pastWork, education } = req.body;
    profile.bio = bio;
    profile.currentPost = currentPost;
    profile.pastWork = pastWork;
    profile.education = education;

    await profile.save();

    return res.json("Profile updated");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserAndProfile = async (req, res) => {
  try {
    const user = req.user;
    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture",
    );

    return res.json(userProfile);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllUsersProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name email username profilePicture",
    );

    return res.json(profiles);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const downloadProfile = async (req, res) => {
  try {
    const user_id = req.query.id;
    const userProfile = await Profile.findOne({ userId: user_id }).populate(
      "userId",
      "name email username profilePicture",
    );

    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    let outputPath = await convetUserDataToPdf(userProfile);

    return res.json({ message: outputPath });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const sendConnectionRequest = async (req, res) => {
  const user = req.user;
  const { connectionId } = req.body;

  try {
    if (String(user._id) === String(connectionId)) {
      return res.status(400).json({ message: "Cannot connect with yourself" });
    }

    const connectionUser = await User.findOne({ _id: connectionId });
    if (!connectionUser) {
      return res.status(404).json({ message: "Connection user not found" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { userId: user._id, connectionId: connectionUser._id },
        { userId: connectionUser._id, connectionId: user._id },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const request = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    await request.save();

    return res.json({ message: "Request sent" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyConnectionsRequests = async (req, res) => {
  const user = req.user;

  try {
    const connections = await ConnectionRequest.find({
      userId: user._id,
    }).populate("connectionId", "name username email profilePicture");

    return res.json(connections);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const whatAreMyConnectionRequests = async (req, res) => {
  const user = req.user;

  try {
    const connections = await ConnectionRequest.find({
      connectionId: user._id,
    }).populate("userId", "name username email profilePicture");

    return res.json(connections);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const acceptConnectionRequest = async (req, res) => {
  const { requestId, action_type } = req.body;
  const user = req.user;

  try {
    const connection = await ConnectionRequest.findOne({
      _id: requestId,
    }).populate("userId", "name username email profilePicture");

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    if (String(connection.connectionId) !== String(user._id)) {
      return res.status(403).json({ message: "Not your request to accept" });
    }

    if (action_type === "accept") {
      connection.status_accepted = true;
      await connection.save();
      return res.json({ message: "Request accepted" });
    }

    await ConnectionRequest.findByIdAndDelete(connection._id);
    return res.json({ message: "Request declined" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyConnections = async (req, res) => {
  const user = req.user;

  try {
    const connections = await ConnectionRequest.find({
      status_accepted: true,
      $or: [{ userId: user._id }, { connectionId: user._id }],
    })
      .populate("userId", "name username email profilePicture")
      .populate("connectionId", "name username email profilePicture");

    const people = connections.map((connection) =>
      String(connection.userId._id) === String(user._id)
        ? connection.connectionId
        : connection.userId,
    );

    return res.json(people);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const cancelConnectionRequest = async (req, res) => {
  const user = req.user;
  const { connectionId } = req.body;

  try {
    const request = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionId,
      status_accepted: null,
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    await ConnectionRequest.findByIdAndDelete(request._id);
    return res.json({ message: "Request cancelled" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getConnectionStatus = async (req, res) => {
  const user = req.user;
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const request = await ConnectionRequest.findOne({
      $or: [
        { userId: user._id, connectionId: userId },
        { userId: userId, connectionId: user._id },
      ],
    });

    if (!request || request.status_accepted === false) {
      return res.status(200).json({ status: "none" });
    }

    if (request.status_accepted === true) {
      return res
        .status(200)
        .json({ status: "connected", requestId: request._id });
    }

    const status =
      String(request.userId) === String(user._id)
        ? "pending_sent"
        : "pending_received";

    return res.status(200).json({ status, requestId: request._id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  const { username, id } = req.query;

  if (!username && !id) {
    return res.status(400).json({ message: "username or id is required" });
  }

  try {
    const query = username ? { username } : { _id: id };
    const user = await User.findOne(query).select(
      "name username email profilePicture",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await Profile.findOne({ userId: user._id });

    return res.status(200).json({ user, profile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
