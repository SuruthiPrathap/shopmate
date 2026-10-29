const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "shopmate_secret_key_2026", {
    expiresIn: "30d",
  });
};
// A business document: JPG / PNG / WEBP image or PDF, sent as a base64 data URL (about 2 MB at most)
const DOC_PATTERN = /^data:(image\/(jpeg|png|webp)|application\/pdf);base64,[A-Za-z0-9+/=]+$/;
const MAX_DOC_LENGTH = 3 * 1024 * 1024;
const { checkRegistration } = require("../utils/registration");

// @desc    Register a new customer account
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: "Please provide name, email and password" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "An account already exists with this email address" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "customer",
      vendorStatus: null,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Customer account created successfully!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        vendorStatus: user.vendorStatus,
        token,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Submit Seller Application (Register as Vendor)
// @route   POST /api/auth/register-seller
// @access  Public
exports.registerSeller = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      businessName,
      businessCategory,
      businessAddress,
      sampleDocumentId,
      documentFileUrl,
      documentFileName,
    } = req.body;

    if (!email || !password || !name || !businessName) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields (Name, Email, Password, Business Name)",
      });
    }

    // The seller must send their GSTIN / Udyam number AND a document
    const registration = checkRegistration(sampleDocumentId);
    if (!registration.valid) {
      return res.status(400).json({
        success: false,
        message: registration.message.startsWith("Please enter")
          ? "A GSTIN or Udyam registration number is required. Please apply with the 'Become a Seller' form."
          : registration.message,
      });
    }
    if (!documentFileUrl) {
      return res.status(400).json({ success: false, message: "Please upload your business document (photo or PDF)" });
    }
    if (typeof documentFileUrl !== "string" || documentFileUrl.length > MAX_DOC_LENGTH || !DOC_PATTERN.test(documentFileUrl)) {
      return res.status(400).json({
        success: false,
        message: "The document must be a JPG, PNG, WEBP image or a PDF under 2 MB",
      });
    }

    // One registration number = one shop
    const numberUsed = await User.findOne({ registrationNumber: registration.number });
    if (numberUsed) {
      return res.status(400).json({
        success: false,
        message: "This registration number is already used by another seller account",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "An account already exists with this email address" });
    }

    // Create user as role: "vendor", vendorStatus: "pending"
    const user = await User.create({
      name,
      email,
      password,
      role: "vendor",
      vendorStatus: "pending",
      phone: phone || "",
      businessName: businessName || `${name}'s Store`,
      businessCategory: businessCategory || "General Merchandise",
      businessAddress: businessAddress || "",
      sampleDocumentId: registration.number,
      registrationType: registration.type,
      registrationNumber: registration.number,
      documentFile: documentFileUrl || undefined,
      documentFileName: documentFileUrl ? String(documentFileName || "document").slice(0, 150) : "",
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Seller application submitted successfully! Your status is currently 'pending' Admin approval.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        vendorStatus: user.vendorStatus,
        phone: user.phone,
        businessName: user.businessName,
        businessCategory: user.businessCategory,
        businessAddress: user.businessAddress,
        sampleDocumentId: user.sampleDocumentId,
        token,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Common Login Endpoint for Customers, Vendors, and Admin
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          vendorStatus: user.vendorStatus,
          phone: user.phone,
          businessName: user.businessName,
          businessCategory: user.businessCategory,
          businessAddress: user.businessAddress,
          sampleDocumentId: user.sampleDocumentId,
          rejectionReason: user.rejectionReason,
          token,
        },
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Current User Profile & Status
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        vendorStatus: user.vendorStatus,
        phone: user.phone,
        businessName: user.businessName,
        businessCategory: user.businessCategory,
        businessAddress: user.businessAddress,
        sampleDocumentId: user.sampleDocumentId,
        rejectionReason: user.rejectionReason,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
