const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const postRoutes = require("./routes/post.routes");
const userRoutes = require("./routes/user.routes");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

const start = async () => {
  const connectDb = await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

start();
