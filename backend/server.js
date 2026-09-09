const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const postRoutes = require("./routes/post.routes");
const userRoutes = require("./routes/user.routes");

const app = express();
const port = process.env.PORT || 5000;

app.set("trust proxy", 1);
app.use(cors({ origin: process.env.CLIENT_URL || true }));
app.use(express.json());

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/uploads", express.static("uploads"));

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();
