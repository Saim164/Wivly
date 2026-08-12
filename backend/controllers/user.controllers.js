const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const Profile = require("../models/profile.model");
const jwt = require("jsonwebtoken");
const PDFDocument = require("pdfkit");
const crypto = require("crypto");
const fs = require("fs");

const convetUserDataToPdf = (userData) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
    const stream = fs.createWriteStream("uploads/" + outputPath);

    doc.pipe(stream);

    doc.image(`uploads/${userData.userId.profilePicture}`, {
      align: "center",
      width: 100,
    });

    doc.fontSize(14).text(`Name : ${userData.userId.name}`);
    doc.fontSize(14).text(`Username : ${userData.userId.username}`);
    doc.fontSize(14).text(`Email : ${userData.userId.email}`);
    doc.fontSize(14).text(`Bio : ${userData.bio}`);
    doc.fontSize(14).text(`Current Position : ${userData.currentPost}`);
    doc.fontSize(14).text("Past Work : ");

    userData.pastWork.forEach((work, index) => {
      doc.fontSize(14).text(`Company : ${work.company}`);
      doc.fontSize(14).text(`Position : ${work.position}`);
      doc.fontSize(14).text(`Years : ${work.years}`);
    });

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
    return res.status(200).json({ token });
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

module.exports = {
  register,
  login,
  uploadProfilePicture,
  updateUserProfile,
  updateProfileData,
  getUserAndProfile,
  getAllUsersProfile,
  downloadProfile,
};
