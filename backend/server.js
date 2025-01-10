const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const taskRoutes = require("./routes/tasks.js");
const userRoutes = require("./routes/users.js");
const categoryRoutes = require("./routes/categories.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });
