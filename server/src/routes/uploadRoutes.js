const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { authenticateUser, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Keep the file in memory (max 5 MB, images only), then stream it to Cloudinary.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    file.mimetype.startsWith("image/") ? cb(null, true) : cb(new Error("Only image files are allowed")),
});

const cloudinaryReady = () =>
  Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

// @route POST /api/upload   (admin or vendor)   form-data field name: "image"
router.post("/", authenticateUser, requireRole("admin", "vendor"), (req, res) => {
  if (!cloudinaryReady()) {
    return res.status(503).json({
      success: false,
      message: "Image upload is not configured yet. Add the CLOUDINARY_* values to server/.env",
    });
  }

  upload.single("image")(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    if (!req.file) return res.status(400).json({ success: false, message: "Please choose an image" });

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const stream = cloudinary.uploader.upload_stream(
      { folder: "shopmate", resource_type: "image" },
      (error, result) => {
        if (error) return res.status(500).json({ success: false, message: error.message });
        res.status(201).json({ success: true, url: result.secure_url });
      }
    );
    stream.end(req.file.buffer);
  });
});

module.exports = router;
