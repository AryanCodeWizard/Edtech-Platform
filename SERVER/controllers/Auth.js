
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");
require("dotenv").config();

// Signup Controller for Registering Users
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, contactNumber, password, confirmPassword, accountType, otp } = req.body;

    if (!firstName || !lastName || !email || !contactNumber || !password || !confirmPassword || !otp) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Fetch recent OTP
    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });
    console.log("Stored OTP:", recentOtp?.otp);
    console.log("Entered OTP:", otp);
    
    if (!recentOtp || recentOtp.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const approved = accountType !== "Instructor";

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    console.log("Profile Created:", profileDetails);

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      approved,
      additionalDetails: profileDetails._id,
      img: ""
    });

    console.log("User Created:", user);

    return res.status(201).json({ success: true, message: "User registered successfully", user });
  } catch (error) {
    console.error("Signup Error:", error.message, error.stack);
    return res.status(500).json({ success: false, message: "User cannot be registered. Please try again.", error: error.message });
  }
};
// Login controller for authenticating users
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Find user and populate additional details
    const user = await User.findOne({ email }).populate("additionalDetails");

    if (!user) {
      return res.status(401).json({ success: false, message: "User not registered. Please sign up first." });
    }

    // Validate password
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email: user.email, id: user._id, accountType: user.accountType }, process.env.JWT_SECRET, { expiresIn: "24h" });

      user.token = token;
      user.password = undefined;

      res.cookie("token", token, { expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), httpOnly: true })
        .status(200)
        .json({ success: true, token, user, message: "User login successful" });
    } else {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Login failed. Please try again." });
  }
};

// Send OTP For Email Verification
exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user already exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, message: "User already registered" });
    }

    let otp;
    let isUnique = false;

    // Generate a unique OTP
    while (!isUnique) {
      otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
      isUnique = !(await OTP.findOne({ otp }));
    }
    console.log(otp);

    // Save OTP to database
    await OTP.create({ email, otp });

    return res.status(200).json({ success: true, message: "OTP sent successfully", otp });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Change Password Controller
exports.changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Validate old password
    if (!(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(401).json({ success: false, message: "Old password is incorrect" });
    }

    // Hash and update new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Password change failed. Please try again." });
  }
};

r