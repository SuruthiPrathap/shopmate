const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["customer", "vendor", "admin"],
      default: "customer",
    },
    vendorStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: null,
    },
    // Seller Application Fields (beginner-friendly dummy doc info)
    phone: { type: String, default: "" },
    businessName: { type: String, default: "" },
    businessCategory: { type: String, default: "" },
    businessAddress: { type: String, default: "" },
    sampleDocumentId: { type: String, default: "" },
        // The seller's uploaded business proof (a data URL). Hidden from normal queries; the admin reads it separately.
    documentFile: { type: String, select: false },
    documentFileName: { type: String, default: "" },
    // GSTIN or Udyam number. Unique, so the same number cannot be used by two shops.
    registrationType: { type: String, default: "" },
    registrationNumber: { type: String, unique: true, sparse: true },
    // Set by the admin after checking the number on the official government portal
    registrationVerified: { type: Boolean, default: false },
    registrationVerifiedAt: { type: Date },
    rejectionReason: { type: String, default: "" },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
