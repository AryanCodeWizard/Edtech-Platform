// const bcrypt = require("bcryptjs")
// const User = require("../models/User")
// const OTP = require("../models/OTP")
// const jwt = require("jsonwebtoken")
// const otpGenerator = require("otp-generator")
// const mailSender = require("../utils/mailSender")
// const { passwordUpdated } = require("../mail/templates/passwordUpdate")
// const Profile = require("../models/Profile")
// require("dotenv").config()

// // Signup Controller for Registering USers

// // exports.signup = async (req, res) => {
// //   try {
// //     // Destructure fields from the request body
// //     const {
// //       firstName,
// //       lastName,
// //       email,
// //       password,
// //       confirmPassword,
// //       accountType,
// //       contactNumber,
// //       otp,
// //     } = req.body
// //     // Check if All Details are there or not
// //     if (
// //       !firstName ||
// //       !lastName ||
// //       !email ||
// //       !password ||
// //       !confirmPassword ||
// //       !otp
// //     ) {
// //       return res.status(403).send({
// //         success: false,
// //         message: "All Fields are required",
// //       })
// //     }
// //     // Check if password and confirm password match
// //     if (password !== confirmPassword) {
// //       return res.status(400).json({
// //         success: false,
// //         message:
// //           "Password and Confirm Password do not match. Please try again.",
// //       })
// //     }

// //     // Check if user already exists
// //     const existingUser = await User.findOne({ email })
// //     if (existingUser) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "User already exists. Please sign in to continue.",
// //       })
// //     }

// //     // Find the most recent OTP for the email
// //     const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)
// //     console.log(response)
// //     if (response.length === 0) {
// //       // OTP not found for the email
// //       return res.status(400).json({
// //         success: false,
// //         message: "The OTP is not valid",
// //       })
// //     } else if (otp !== response[0].otp) {
// //       // Invalid OTP
// //       return res.status(400).json({
// //         success: false,
// //         message: "The OTP is not valid",
// //       })
// //     }

// //     // Hash the password
// //     const hashedPassword = await bcrypt.hash(password, 10)

// //     // Create the user
// //     let approved = ""
// //     approved === "Instructor" ? (approved = false) : (approved = true)

// //     // Create the Additional Profile For User
// //     const profileDetails = await Profile.create({
// //       gender: null,
// //       dateOfBirth: null,
// //       about: null,
// //       contactNumber: null,
// //     })
// //     const user = await User.create({
// //       firstName,
// //       lastName,
// //       email,
// //       contactNumber,
// //       password: hashedPassword,
// //       accountType: accountType,
// //       approved: approved,
// //       additionalDetails: profileDetails._id,
// //       image: "",
// //     })

// //     return res.status(200).json({
// //       success: true,
// //       user,
// //       message: "User registered successfully",
// //     })
// //   } catch (error) {
// //     console.error(error)
// //     return res.status(500).json({
// //       success: false,
// //       message: "User cannot be registered. Please try again.",
// //     })
// //   }
// // }

// exports.signup = async (req, res) => {
//   try {
//     // Fetch data
//     const { firstName, lastName, email, contactNumber, password, confirmPassword, accountType, otp } = req.body;

//     // Validate input fields
//     if (!firstName || !lastName || !email || !contactNumber || !password || !confirmPassword || !otp) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     // Check if passwords match
//     if (password !== confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "Passwords do not match",
//       });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists",
//       });
//     }

//     // Find OTP record
//     const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);
//     if (!recentOtp || recentOtp.otp !== otp) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid or expired OTP",
//       });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Determine approval status
//     const approved = accountType === "Instructor" ? false : true;

//     // Create profile
//     const profileDetails = await Profile.create({
//       gender: null,
//       dateOfBirth: null,
//       about: null,
//       contactNumber: null,
//     });

//     // Check if profile creation succeeded
//     if (!profileDetails) {
//       return res.status(500).json({
//         success: false,
//         message: "Failed to create user profile",
//       });
//     }

//     // Create user
//     const user = await User.create({
//       firstName,
//       lastName,
//       email,
//       contactNumber,
//       password: hashedPassword,
//       accountType,
//       approved,
//       additionalDetails: profileDetails._id,
//       image: "",
//     });

//     if (!user) {
//       return res.status(500).json({
//         success: false,
//         message: "User creation failed",
//       });
//     }

//     return res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       user,
//     });
//   } catch (error) {
//     console.error("Signup Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "User cannot be registered. Please try again.",
//       error: error.message,
//     });
//   }
// };

// // Login controller for authenticating users
// exports.login = async (req, res) => {
//   try {
//     // Get email and password from request body
//     const { email, password } = req.body

//     // Check if email or password is missing
//     if (!email || !password) {
//       // Return 400 Bad Request status code with error message
//       return res.status(400).json({
//         success: false,
//         message: `Please Fill up All the Required Fields`,
//       })
//     }

//     // Find user with provided email
//     const user = await User.findOne({ email }).populate("additionalDetails")

//     // If user not found with provided email
//     if (!user) {
//       // Return 401 Unauthorized status code with error message
//       return res.status(401).json({
//         success: false,
//         message: `User is not Registered with Us Please SignUp to Continue`,
//       })
//     }

//     // Generate JWT token and Compare Password
//     if (await bcrypt.compare(password, user.password)) {
//       const token = jwt.sign(
//         { email: user.email, id: user._id, role: user.role },
//         process.env.JWT_SECRET,
//         {
//           expiresIn: "24h",
//         }
//       )

//       // Save token to user document in database
//       user.token = token
//       user.password = undefined
//       // Set cookie for token and return success response
//       const options = {
//         expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//         httpOnly: true,
//       }
//       res.cookie("token", token, options).status(200).json({
//         success: true,
//         token,
//         user,
//         message: `User Login Success`,
//       })
//     } else {
//       return res.status(401).json({
//         success: false,
//         message: `Password is incorrect`,
//       })
//     }
//   } catch (error) {
//     console.error(error)
//     // Return 500 Internal Server Error status code with error message
//     return res.status(500).json({
//       success: false,
//       message: `Login Failure Please Try Again`,
//     })
//   }
// }
// // Send OTP For Email Verification
// exports.sendotp = async (req, res) => {
//   try {
//     const { email } = req.body

//     // Check if user is already present
//     // Find user with provided email
//     const checkUserPresent = await User.findOne({ email })
//     // to be used in case of signup

//     // If user found with provided email
//     if (checkUserPresent) {
//       // Return 401 Unauthorized status code with error message
//       return res.status(401).json({
//         success: false,
//         message: `User is Already Registered`,
//       })
//     }

//     var otp = otpGenerator.generate(6, {
//       upperCaseAlphabets: false,
//       lowerCaseAlphabets: false,
//       specialChars: false,
//     })
//     const result = await OTP.findOne({ otp: otp })
//     console.log("Result is Generate OTP Func")
//     console.log("OTP", otp)
//     console.log("Result", result)
//     while (result) {
//       otp = otpGenerator.generate(6, {
//         upperCaseAlphabets: false,
//       })
//     }
//     const otpPayload = { email, otp }
//     const otpBody = await OTP.create(otpPayload)
//     console.log("OTP Body", otpBody)
//     res.status(200).json({
//       success: true,
//       message: `OTP Sent Successfully`,
//       otp,
//     })
//   } catch (error) {
//     console.log(error.message)
//     return res.status(500).json({ success: false, error: error.message })
//   }
// }

// // Controller for Changing Password
// exports.changePassword = async (req, res) => {
//   try {
//     // Get user data from req.user
//     const userDetails = await User.findById(req.user.id)

//     // Get old password, new password, and confirm new password from req.body
//     const { oldPassword, newPassword } = req.body

//     // Validate old password
//     const isPasswordMatch = await bcrypt.compare(
//       oldPassword,
//       userDetails.password
//     )
//     if (!isPasswordMatch) {
//       // If old password does not match, return a 401 (Unauthorized) error
//       return res
//         .status(401)
//         .json({ success: false, message: "The password is incorrect" })
//     }

//     // Update password
//     const encryptedPassword = await bcrypt.hash(newPassword, 10)
//     const updatedUserDetails = await User.findByIdAndUpdate(
//       req.user.id,
//       { password: encryptedPassword },
//       { new: true }
//     )

//     // Send notification email
//     try {
//       const emailResponse = await mailSender(
//         updatedUserDetails.email,
//         "Password for your account has been updated",
//         passwordUpdated(
//           updatedUserDetails.email,
//           `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
//         )
//       )
//       console.log("Email sent successfully:", emailResponse.response)
//     } catch (error) {
//       // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
//       console.error("Error occurred while sending email:", error)
//       return res.status(500).json({
//         success: false,
//         message: "Error occurred while sending email",
//         error: error.message,
//       })
//     }

//     // Return success response
//     return res
//       .status(200)
//       .json({ success: true, message: "Password updated successfully" })
//   } catch (error) {
//     // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
//     console.error("Error occurred while updating password:", error)
//     return res.status(500).json({
//       success: false,
//       message: "Error occurred while updating password",
//       error: error.message,
//     })
//   }
// }

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
