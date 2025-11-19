const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const DEFAULT_MONGO_URI = "mongodb://127.0.0.1:27017/fundtracker";

const app = express();

// CORS configuration - allow requests from frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
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

const normalizeMongoUri = (rawUri) => {
  const fallback = DEFAULT_MONGO_URI;
  if (!rawUri || !rawUri.trim()) {
    console.warn("⚠️ MONGO_URI is missing. Falling back to default local MongoDB.");
    return fallback;
  }

  let value = rawUri.trim();

  // Allow users to pass just a database name or path (e.g., "fundtracker" or "/fundtracker")
  const hasMongoProtocol =
    value.startsWith("mongodb://") || value.startsWith("mongodb+srv://");
  if (!hasMongoProtocol) {
    const sanitizedDb = value.replace(/^\/+/, "") || "fundtracker";
    const finalUri = `mongodb://127.0.0.1:27017/${sanitizedDb}`;
    console.warn(
      `⚠️ MONGO_URI did not include a protocol/host. Using local MongoDB: ${finalUri}`
    );
    return finalUri;
  }

  try {
    const parsed = new URL(value);
    const isSrv = parsed.protocol === "mongodb+srv:";

    if (!parsed.hostname) {
      if (isSrv) {
        console.warn(
          "⚠️ MONGO_URI (mongodb+srv) is missing a hostname. Falling back to default local MongoDB."
        );
        return fallback;
      }
      parsed.hostname = "127.0.0.1";
      if (!parsed.port) {
        parsed.port = "27017";
      }
    }

    if (!isSrv && !parsed.port) {
      parsed.port = "27017";
    }

    const currentPath = parsed.pathname || "/";
    if (currentPath === "/" || currentPath === "") {
      parsed.pathname = "/fundtracker";
    } else {
      parsed.pathname = `/${currentPath.replace(/^\/+/, "")}`;
    }

    return parsed.toString();
  } catch (err) {
    console.warn(
      `⚠️ MONGO_URI "${value}" is invalid (${err.message}). Falling back to default local MongoDB.`
    );
    return fallback;
  }
};

let mongoUri = normalizeMongoUri(process.env.MONGO_URI);

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
  const frontendPath = path.join(__dirname, "frontend", "build");

  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
     res.sendFile(path.join(frontendPath, "index.html"));
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
