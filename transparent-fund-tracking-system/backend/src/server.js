import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

dotenv.config();
const require = createRequire(import.meta.url);

const DEFAULT_MONGO_URI = "mongodb://127.0.0.1:27017/fundtracker";

const app = express();

// -------------------------------------------
// CORS CONFIG (env-configurable)
// -------------------------------------------
const rawCors = process.env.CORS_ORIGIN;
let allowedOrigins;
if (rawCors) {
  allowedOrigins = rawCors === "*" ? "*" : rawCors.split(",").map((s) => s.trim());
} else {
  allowedOrigins = ["http://localhost:3000"];
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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// -------------------------------------------
// API ROUTES (CommonJS modules via createRequire)
// -------------------------------------------
try {
  app.use("/api/fund", require("../routes/fund"));
  app.use("/api/transactions", require("../routes/transactionRoutes"));
  app.use("/api/admin", require("../routes/adminRoutes"));
  app.use("/api/utilization", require("../routes/utilizationRoutes"));
  app.use("/api/public", require("../routes/publicRoutes"));
  app.use("/api/auth", require("../routes/authRoutes"));
} catch (err) {
  console.warn("Warning: some routes could not be loaded:", err.message);
}

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

// Connect to Mongo (cached connection for serverless environments)
let cached = global._mongoosePromise; // eslint-disable-line no-underscore-dangle
if (!cached) {
  cached = mongoose.connect(mongoUri).then(() => mongoose);
  global._mongoosePromise = cached; // eslint-disable-line no-underscore-dangle
}

cached
  .then(() => {
    try {
      console.log("✅ MongoDB Connected Successfully");
      console.log("📊 Database:", mongoose.connection.db.databaseName);
    } catch (e) {
      // ignore when running in serverless cold starts
    }
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });

// -------------------------------------------
// Root handler — must return JSON on GET /
// -------------------------------------------
app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend API Running Successfully 🚀" });
});

// -------------------------------------------
// 404 Handler
// -------------------------------------------
app.use((req, res) => {
  res.status(404).json({ message: "API Route Not Found" });
});

// -------------------------------------------
// Export the Express app as default (no app.listen)
// -------------------------------------------
export default app;
