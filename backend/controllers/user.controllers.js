const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const fs = require("fs");
const PDFDocument = require("pdfkit");

const User = require("../models/user.model");
const Profile = require("../models/profile.model");
const ConnectionRequest = require("../models/connection.model");
const { uploadToCloudinary } = require("../config/cloudinary");

const resolveResumeImage = async (picture) => {
  try {
    if (!picture) return null;

    if (picture.startsWith("http")) {
      const response = await fetch(picture);
      if (!response.ok) return null;
      return Buffer.from(await response.arrayBuffer());
    }

    const localPath = `uploads/${picture}`;
    return fs.existsSync(localPath) ? localPath : null;
  } catch (error) {
    return null;
  }
};

const buildResumePdf = (profile, image) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const fileName = crypto.randomBytes(32).toString("hex") + ".pdf";
    const stream = fs.createWriteStream("uploads/" + fileName);

    doc.pipe(stream);

    const ink = "#201417";
    const brand = "#c2255f";
    const muted = "#6b6b6b";
    const rule = "#e5e0e2";

    if (image) {
      try {
        doc.image(image, doc.page.width - 110, 50, { width: 60, height: 60 });
      } catch (error) {
        // an unreadable image should not break the resume
      }
    }

    doc.fillColor(ink).fontSize(24).text(profile.userId.name);
    doc.moveDown(0.2);
    doc.fillColor(brand).fontSize(12).text(`@${profile.userId.username}`);
    if (profile.currentPost) {
      doc.fillColor(ink).fontSize(12).text(profile.currentPost);
    }
    doc.fillColor(muted).fontSize(10).text(profile.userId.email);

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

    if (profile.bio) {
      section("About");
      doc.fillColor(ink).fontSize(11).text(profile.bio);
    }

    if (profile.pastWork && profile.pastWork.length > 0) {
      section("Experience");
      profile.pastWork.forEach((work) => {
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

    if (profile.education && profile.education.length > 0) {
      section("Education");
      profile.education.forEach((edu) => {
        doc.fillColor(ink).fontSize(11).text(edu.school);
        const detail = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(", ");
        if (detail) {
          doc.fillColor(muted).fontSize(10).text(detail);
        }
        doc.moveDown(0.5);
      });
    }

    doc.end();

    stream.on("finish", () => resolve(fileName));
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    await Profile.create({ userId: newUser._id });

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
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const result = await uploadToCloudinary(req.file.buffer);
    req.user.profilePicture = result.secure_url;
    await req.user.save();

    return res.status(200).json({
      message: "Profile picture updated",
      profilePicture: req.user.profilePicture,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateProfileData = async (req, res) => {
  try {
    const { bio, currentPost, pastWork, education } = req.body;

    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.bio = bio;
    profile.currentPost = currentPost;
    profile.pastWork = pastWork;
    profile.education = education;
    await profile.save();

    return res.status(200).json({ message: "Profile updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserAndProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id }).populate(
      "userId",
      "name email username profilePicture",
    );

    return res.status(200).json(profile);
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
    const user = await User.findOne(username ? { username } : { _id: id }).select(
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

const getAllUsersProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name email username profilePicture",
    );

    return res.status(200).json(profiles);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getTopUsers = async (req, res) => {
  try {
    const accepted = await ConnectionRequest.find({ status_accepted: true });

    const countById = {};
    accepted.forEach((request) => {
      countById[request.userId] = (countById[request.userId] || 0) + 1;
      countById[request.connectionId] =
        (countById[request.connectionId] || 0) + 1;
    });

    const users = await User.find({ _id: { $ne: req.user._id } }).select(
      "name username profilePicture",
    );

    const ranked = users
      .map((user) => ({
        _id: user._id,
        name: user.name,
        username: user.username,
        profilePicture: user.profilePicture,
        connections: countById[user._id] || 0,
      }))
      .sort((a, b) => b.connections - a.connections)
      .slice(0, 5);

    return res.status(200).json(ranked);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const downloadResume = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.query.id }).populate(
      "userId",
      "name email username profilePicture",
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const image = await resolveResumeImage(profile.userId.profilePicture);
    const fileName = await buildResumePdf(profile, image);

    return res.status(200).json({ message: fileName });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const sendConnectionRequest = async (req, res) => {
  const { connectionId } = req.body;

  try {
    if (String(req.user._id) === String(connectionId)) {
      return res.status(400).json({ message: "Cannot connect with yourself" });
    }

    const target = await User.findById(connectionId);
    if (!target) {
      return res.status(404).json({ message: "User not found" });
    }

    const existing = await ConnectionRequest.findOne({
      $or: [
        { userId: req.user._id, connectionId: target._id },
        { userId: target._id, connectionId: req.user._id },
      ],
    });

    if (existing) {
      return res.status(400).json({ message: "Request already exists" });
    }

    await ConnectionRequest.create({
      userId: req.user._id,
      connectionId: target._id,
    });

    return res.status(200).json({ message: "Request sent" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const cancelConnectionRequest = async (req, res) => {
  const { connectionId } = req.body;

  try {
    const request = await ConnectionRequest.findOne({
      userId: req.user._id,
      connectionId,
      status_accepted: null,
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    await ConnectionRequest.findByIdAndDelete(request._id);

    return res.status(200).json({ message: "Request cancelled" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const respondConnectionRequest = async (req, res) => {
  const { requestId, action_type } = req.body;

  try {
    const request = await ConnectionRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (String(request.connectionId) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not your request to respond to" });
    }

    if (action_type === "accept") {
      request.status_accepted = true;
      await request.save();
      return res.status(200).json({ message: "Request accepted" });
    }

    await ConnectionRequest.findByIdAndDelete(request._id);
    return res.status(200).json({ message: "Request declined" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getReceivedRequests = async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({
      connectionId: req.user._id,
      status_accepted: null,
    }).populate("userId", "name username email profilePicture");

    return res.status(200).json(requests);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyConnections = async (req, res) => {
  try {
    const connections = await ConnectionRequest.find({
      status_accepted: true,
      $or: [{ userId: req.user._id }, { connectionId: req.user._id }],
    })
      .populate("userId", "name username email profilePicture")
      .populate("connectionId", "name username email profilePicture");

    const people = connections.map((connection) =>
      String(connection.userId._id) === String(req.user._id)
        ? connection.connectionId
        : connection.userId,
    );

    return res.status(200).json(people);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getConnectionStatus = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const request = await ConnectionRequest.findOne({
      $or: [
        { userId: req.user._id, connectionId: userId },
        { userId, connectionId: req.user._id },
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
      String(request.userId) === String(req.user._id)
        ? "pending_sent"
        : "pending_received";

    return res.status(200).json({ status, requestId: request._id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
