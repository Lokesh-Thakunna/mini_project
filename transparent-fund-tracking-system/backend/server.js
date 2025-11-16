const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
const fundRoutes = require("./routes/fund");
const transactionRoutes = require("./routes/transactionRoutes");
const adminRoutes = require("./routes/adminRoutes");
const utilizationRoutes = require("./routes/utilizationRoutes");
const publicRoutes = require("./routes/publicRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/fund", fundRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/utilization", utilizationRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/auth", authRoutes);

// ✅ MongoDB connection
mongoose.set("strictQuery", true);

// Ensure database name is in connection string
let mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("❌ MONGO_URI is not set in .env file!");
  console.log("Please set MONGO_URI in backend/.env");
} else {
  // If using MongoDB Atlas and database name is missing, add it
  if (mongoUri.includes('mongodb+srv://') && !mongoUri.includes('/fundtracker')) {
    mongoUri = mongoUri.replace(/\?/, '/fundtracker?');
    if (!mongoUri.includes('?')) {
      mongoUri += '?retryWrites=true&w=majority';
    }
  }
  // If using local MongoDB and database name is missing, add it
  else if (mongoUri.includes('mongodb://') && !mongoUri.split('/').slice(-1)[0].includes('?')) {
    if (!mongoUri.endsWith('/fundtracker') && !mongoUri.includes('/fundtracker')) {
      mongoUri = mongoUri.replace(/\/$/, '') + '/fundtracker';
    }
  }

  mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("✅ MongoDB Connected Successfully");
      console.log("📊 Database:", mongoose.connection.db.databaseName);
    })
    .catch((err) => {
      console.error("❌ MongoDB Connection Error:", err.message);
      console.log("\nTroubleshooting:");
      console.log("1. Check if MongoDB is running");
      console.log("2. Verify MONGO_URI in backend/.env");
      console.log("3. For Atlas: Make sure database name is included");
      console.log("4. Example: mongodb+srv://user:pass@cluster.mongodb.net/fundtracker");
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
