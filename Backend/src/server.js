const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/db");
const habitRoutes = require("./routes/habitRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/habits", habitRoutes);

// Start server
sequelize.sync().then(() => {
  app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
});
