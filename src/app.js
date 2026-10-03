const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const { notFound, errorHandler } = require("./middleware/errors");

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.get("/api/health", (_request, response) => response.json({ success: true, message: "API is running" }));
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
