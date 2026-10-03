const jwt = require("jsonwebtoken");
const User = require("../models/User");

function getToken(request) {
  const cookieToken = request.cookies?.token;
  if (cookieToken) return cookieToken;

  const authorization = request.get("authorization");
  if (authorization?.startsWith("Bearer ")) return authorization.slice(7);
  return null;
}

async function requireAuth(request, response, next) {
  const token = getToken(request);
  if (!token) {
    return response.status(401).json({ success: false, message: "Authentication required" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId);
    if (!user) {
      return response.status(401).json({ success: false, message: "User no longer exists" });
    }
    request.user = user;
    return next();
  } catch (error) {
    return response.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

module.exports = requireAuth;
