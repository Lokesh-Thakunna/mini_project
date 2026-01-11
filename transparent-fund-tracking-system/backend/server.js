const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const DEFAULT_MONGO_URI = "mongodb://127.0.0.1:27017/fundtracker";

const app = express();

// -------------------------------------------
// CORS CONFIG (env-configurable)
// - Set CORS_ORIGIN env var as comma-separated list or '*' to allow all
// - Example: CORS_ORIGIN="http://example.com,http://localhost:3000"
// -------------------------------------------
const rawCors = process.env.CORS_ORIGIN;
let allowedOrigins;
if (rawCors) {
  allowedOrigins = rawCors === "*" ? "*" : rawCors.split(",").map((s) => s.trim());
} else {
  allowedOrigins = [
    "https://stalwart-profiterole-2fea66.netlify.app",
    "http://localhost:3000",
  ];
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins === "*") return callback(null, true);
      if (Array.isArray(allowedOrigins) && allowedOrigins.indexOf(origin) !== -1)
        return callback(null, true);
      return callback(new Error("CORS: Origin not allowed"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

// -------------------------------------------
// Static Uploads
// -------------------------------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -------------------------------------------
// API ROUTES
// -------------------------------------------
app.use("/api/fund", require("./routes/fund"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/utilization", require("./routes/utilizationRoutes"));
app.use("/api/public", require("./routes/publicRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

// -------------------------------------------
// MongoDB NORMALIZED CONNECTION
// -------------------------------------------
mongoose.set("strictQuery", true);

const normalizeMongoUri = (rawUri) => {
  const fallback = DEFAULT_MONGO_URI;

  if (!rawUri || !rawUri.trim()) {
    console.warn("⚠️ Missing MONGO_URI → Using local MongoDB.");
    return fallback;
  }

  let value = rawUri.trim();

  // If user enters only DB name (example: fundtracker)
  if (!value.startsWith("mongodb://") && !value.startsWith("mongodb+srv://")) {
    const dbName = value.replace(/^\/+/, "") || "fundtracker";
    return `mongodb://127.0.0.1:27017/${dbName}`;
  }

  try {
    const parsed = new URL(value);
    if (!parsed.pathname || parsed.pathname === "/") {
      parsed.pathname = "/fundtracker";
    }
    return parsed.toString();
  } catch (err) {
    console.warn("⚠️ Invalid MONGO_URI → Using local MongoDB.");
    return fallback;
  }
};

const mongoUri = normalizeMongoUri(process.env.MONGO_URI);

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    console.log("📊 Database:", mongoose.connection.db.databaseName);
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });

// -------------------------------------------
// REMOVE FRONTEND SERVING (Netlify handles it)
// -------------------------------------------
app.get("/", (req, res) => {
  res.send("Backend API Running Successfully 🚀");
});

// -------------------------------------------
// 404 Handler (REPLACES app.get('*'))
// -------------------------------------------
app.use((req, res) => {
  res.status(404).json({ message: "API Route Not Found" });
});

// -------------------------------------------
// Optionally serve frontend build when requested
// Set SERVE_FRONTEND=true to serve frontend/build from the backend
// -------------------------------------------
if (process.env.SERVE_FRONTEND === "true") {
  const frontendBuild = path.join(__dirname, "..", "frontend", "build");
  app.use(express.static(frontendBuild));
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendBuild, "index.html"));
  });
}

// -------------------------------------------
// START SERVER (bind to HOST so LAN access works)
// -------------------------------------------
const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 5000;
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});
