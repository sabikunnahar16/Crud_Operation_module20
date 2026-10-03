const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function issueToken(userId) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
}

function setAuthCookie(response, token) {
  response.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

async function register(request, response) {
  const { name, email, password, phoneNumber } = request.body;
  if (!name || !email || !password) {
    return response.status(400).json({ success: false, message: "name, email, and password are required" });
  }
  if (password.length < 8) {
    return response.status(400).json({ success: false, message: "Password must be at least 8 characters" });
  }
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) return response.status(409).json({ success: false, message: "Email is already registered" });

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: await bcrypt.hash(password, 12),
    phoneNumber
  });
  const token = issueToken(user._id.toString());
  setAuthCookie(response, token);
  return response.status(201).json({ success: true, message: "Registration successful", user: user.toSafeObject(), token });
}

async function login(request, response) {
  const { email, password } = request.body;
  const user = await User.findOne({ email: email?.toLowerCase() }).select("+password");
  if (!user || !(await bcrypt.compare(password || "", user.password))) {
    return response.status(401).json({ success: false, message: "Invalid email or password" });
  }
  const token = issueToken(user._id.toString());
  setAuthCookie(response, token);
  return response.json({ success: true, message: "Login successful", user: user.toSafeObject(), token });
}

async function logout(_request, response) {
  response.clearCookie("token");
  return response.json({ success: true, message: "Logged out successfully" });
}

async function profile(request, response) {
  return response.json({ success: true, user: request.user.toSafeObject() });
}

async function updateProfile(request, response) {
  const allowedFields = ["name", "phoneNumber", "email"];
  const updates = {};
  for (const field of allowedFields) {
    if (request.body[field] !== undefined) updates[field] = request.body[field];
  }
  if (updates.email) updates.email = updates.email.toLowerCase();
  const user = await User.findByIdAndUpdate(request.user._id, updates, {
    new: true,
    runValidators: true
  });
  return response.json({ success: true, message: "Profile updated", user: user.toSafeObject() });
}

module.exports = { register, login, logout, profile, updateProfile };
