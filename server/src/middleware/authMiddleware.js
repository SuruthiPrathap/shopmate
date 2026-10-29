const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 1. Authenticate User Middleware
const authenticateUser = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "shopmate_secret_key_2026"
      );

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ success: false, message: "User account not found" });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token provided" });
  }
};

// 2. Role Authorization Middleware (e.g. requireRole('admin'), requireRole('vendor'))
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to roles: [${allowedRoles.join(", ")}]`,
      });
    }
    next();
  };
};

// 3. Approved Vendor Middleware (Ensures role === "vendor" AND vendorStatus === "approved")
const requireApprovedVendor = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  if (req.user.role !== "vendor") {
    return res.status(403).json({ success: false, message: "Access restricted to vendor accounts" });
  }

  if (req.user.vendorStatus !== "approved") {
    return res.status(403).json({
      success: false,
      message: `Vendor functionality disabled. Your seller status is currently '${req.user.vendorStatus || "pending"}'. Approval required by Admin.`,
    });
  }

  next();
};

// Alias for backward compatibility
const protect = authenticateUser;
const adminOnly = requireRole("admin");

module.exports = {
  authenticateUser,
  protect,
  requireRole,
  adminOnly,
  requireApprovedVendor,
};
