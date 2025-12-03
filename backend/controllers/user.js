import { CatchAsyncError } from "../middlewares/CatchAsyncError.js";
import User from "../models/userModal.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { fileURLToPath } from "url";
import { sendMail } from "../utils/sendMail.js";
import Audit from "../models/auditModal.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import path from "path";
import crypto from "crypto";
import fs from "fs/promises";
import cloudinary from "../utils/cloudinaryConfig.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const phoneRegex = /^(\+?\d{1,4}[\s-]?)?\d{10,15}$/;

export const registrationUser = CatchAsyncError(async (req, res, next) => {
  const { name, email, password, confirmPassword, phone } = req.body;

  if (!emailRegex.test(email))
    return next(new ErrorHandler("Invalid email format", 400));

  if (!passwordRegex.test(password))
    return next(
      new ErrorHandler(
        "Password must be at least 8 characters long, include uppercase, lowercase, and number",
        400
      )
    );

  if (password !== confirmPassword)
    return next(new ErrorHandler("Passwords do not match", 400));

  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new ErrorHandler("Email Already Exists", 400));

  const tempUser = { name, email, password, phone };

  const { token, activationCode } = createActivationToken(tempUser);

  try {
    await sendMail({
      email,
      subject: "Verify Your Email",
      template: "activation-mail.ejs",
      data: { user: { name }, activationCode },
    });

    res.cookie("activationToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 5 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: `Please check your email: ${email} for the activation code`,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

export const createActivationToken = (user) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let activationCode = "";
  for (let i = 0; i < 6; i++) {
    activationCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET,
    { expiresIn: "5m" }
  );

  return { token, activationCode };
};

export const resendActivationOtp = CatchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) return next(new ErrorHandler("Email is required", 400));

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return next(
      new ErrorHandler("Email already registered. Please login instead.", 400)
    );

  const tempUser = { email };
  const { token, activationCode } = createActivationToken(tempUser);

  try {
    await sendMail({
      email,
      subject: "Your Activation Code",
      template: "activation-mail.ejs",
      data: { user: { email }, activationCode },
    });

    res.cookie("activationToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 5 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: `A new activation code has been sent to ${email}. Please check your inbox.`,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

export const activateUser = CatchAsyncError(async (req, res, next) => {
  const { activation_code } = req.body;
  const token = req.cookies.activationToken;

  if (!token) return next(new ErrorHandler("Activation token is missing", 400));

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACTIVATION_SECRET);
  } catch (err) {
    return next(new ErrorHandler("Activation token expired or invalid", 400));
  }

  if (decoded.activationCode !== activation_code)
    return next(new ErrorHandler("Invalid Activation Code", 400));

  const { name, email, password, phone } = decoded.user;

  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new ErrorHandler("Email Already Exists", 400));

  const user = await User.create({
    name,
    email,
    password,
    phone,
  });

  user.password = undefined;

  res.clearCookie("activationToken");

  res.status(201).json({
    success: true,
    message: "User Registered Successfully!",
    user,
  });
});

export const loginUser = CatchAsyncError(async (req, res, next) => {
  const { identifier, password, location } = req.body;

  if (!identifier || !password) {
    return next(new ErrorHandler("Please enter Email/Phone and Password", 400));
  }

  const user = await User.findOne({
    $or: [{ email: identifier }, { phone: identifier }],
  }).select("+password +refreshTokenHash");

  if (!user) {
    return next(new ErrorHandler("Invalid Email/Phone or Password", 400));
  }

  if (user.lockDate && user.lockDate > Date.now()) {
    const remainingMinutes = Math.ceil((user.lockDate - Date.now()) / 60000);
    return next(
      new ErrorHandler(
        `Account is locked due to multiple failed attempts. Try again in ${remainingMinutes} minute(s).`,
        403
      )
    );
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    user.incrementLoginAttempts();
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler("Invalid Email/Phone or Password", 400));
  }

  user.loginAttempts = 0;
  user.lockDate = null;
  user.lastActive = Date.now();

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  user.refreshTokenHash = refreshTokenHash;
  await user.save({ validateBeforeSave: false });

  await Audit.create({
    userId: user._id,
    type: "login",
    ipAddress: req.ip || req.headers["x-forwarded-for"] || "Unknown",
    location: location || "Unknown",
    deviceInfo: req.headers["user-agent"] || "Unknown",
    refreshTokenHash,
    isRevoked: false,
  });

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });

  const userResponse = await User.findById(user._id).select(
    "-password -refreshTokenHash -twoFactorSecret -mfaRecoveryCodes"
  );

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    user: userResponse,
  });
});

export const logoutUser = CatchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const refreshToken = req.cookies.refreshToken;

  if (!userId || !refreshToken) {
    return next(new ErrorHandler("Invalid request or user not logged in", 400));
  }

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  const user = await User.findById(userId);
  if (user) {
    user.refreshTokenHash = null;
    await user.save({ validateBeforeSave: false });
  }

  const latestAudit = await Audit.findOne({ user: userId }).sort({
    createdAt: -1,
  });
  if (latestAudit) {
    latestAudit.logoutAt = new Date();
    latestAudit.isRevoked = true;
    await latestAudit.save();
  }

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

export const refreshAccessToken = CatchAsyncError(async (req, res, next) => {
  const incomingRefreshToken = req.cookies.refreshToken;
  if (!incomingRefreshToken) {
    return next(
      new ErrorHandler("Unauthorized request! No refresh token provided", 401)
    );
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);
    if (!user) return next(new ErrorHandler("User not found!", 404));

    const incomingTokenHash = crypto
      .createHash("sha256")
      .update(incomingRefreshToken)
      .digest("hex");
    if (incomingTokenHash !== user.refreshTokenHash) {
      return next(
        new ErrorHandler("Refresh token is invalid or revoked!", 401)
      );
    }

    const accessToken = await user.generateAccessToken();
    const newRefreshToken = await user.generateRefreshToken();

    user.refreshTokenHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");
    await user.save({ validateBeforeSave: false });

    await Audit.create({
      userId: user._id,
      type: "refresh_token",
      ipAddress: req.ip || req.headers["x-forwarded-for"] || "Unknown",
      location: req.body.location || "Unknown",
      deviceInfo: req.headers["user-agent"] || "Unknown",
      refreshTokenHash: user.refreshTokenHash,
      isRevoked: false,
    });

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "strict" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "strict" : "lax",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Tokens refreshed successfully",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(
        new ErrorHandler("Refresh token expired. Please login again.", 401)
      );
    }
    if (error.name === "JsonWebTokenError") {
      return next(new ErrorHandler("Invalid refresh token.", 401));
    }
    return next(new ErrorHandler(error.message, 500));
  }
});

export const generateResetPasswordToken = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) return next(new ErrorHandler("Email is required!", 400));

    const user = await User.findOne({ email });
    if (!user) return next(new ErrorHandler("User not found!", 404));

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendMail({
      email: user.email,
      subject: "Password Reset Request",
      template: "reset-password.ejs",
      data: {
        user,
        resetLink: resetUrl,
      },
    });

    res.status(200).json({
      success: true,
      message: `Password reset link sent to ${user.email}`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const resetPassword = async (req, res, next) => {
  const { token, newPassword, confirmPassword } = req.body;

  if (!token) return next(new ErrorHandler("Reset token is missing", 400));
  if (!newPassword || !confirmPassword)
    return next(
      new ErrorHandler("Both newPassword and confirmPassword are required", 400)
    );
  if (newPassword !== confirmPassword)
    return next(new ErrorHandler("Passwords do not match", 400));

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return next(
      new ErrorHandler(
        "Password must be at least 8 characters long and include uppercase, lowercase, and a number",
        400
      )
    );
  }

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return next(new ErrorHandler("Invalid or expired reset token", 400));

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.passwordChangedAt = Date.now();

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const getCurrentUser = CatchAsyncError(async (req, res, next) => {
  const userId = req.user?._id;

  if (!userId) return next(new ErrorHandler("Unauthorized access", 401));

  const user = await User.findById(userId).select(
    "-password -refreshTokenHash -twoFactorToken -mfaRecoveryCodes"
  );

  if (!user) return next(new ErrorHandler("User not found", 404));

  user.lastActive = Date.now();
  await user.save({ validateBeforeSave: false });

  await Audit.create({
    userId: user._id,
    type: "profile_access",
    ipAddress: req.ip || req.headers["x-forwarded-for"] || "Unknown",
    location: (req.body && req.body.location) || "Unknown",
    deviceInfo: req.headers["user-agent"] || "Unknown",
    refreshTokenHash: "",
    isRevoked: false,
  });

  res.status(200).json({
    success: true,
    message: "User profile retrieved successfully",
    user,
  });
});

export const updateUserProfile = CatchAsyncError(async (req, res, next) => {
  const userId = req.user?._id;
  if (!userId) return next(new ErrorHandler("Unauthorized access", 401));

  const { name, phone, language } = req.body;
  let avatarFilePath = req.file?.path;
  let uploadedAvatar = null;

  const address = {
    line1: req.body["address[line1]"] || "",
    city: req.body["address[city]"] || "",
    state: req.body["address[state]"] || "",
    zip: req.body["address[zip]"] || "",
  };

  try {
    const user = await User.findById(userId);
    if (!user) return next(new ErrorHandler("User not found", 404));

    if (phone && !phoneRegex.test(phone)) {
      return next(new ErrorHandler("Invalid phone number format", 400));
    }

    if (phone && phone !== user.phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists)
        return next(new ErrorHandler("Phone number already in use", 400));
      user.phone = phone.trim();
    }

    if (name) user.name = name.trim();
    if (language) user.language = language;

    if (address.line1 || address.city || address.state || address.zip) {
      user.address = {
        ...(user.address || {}),
        ...address,
      };
    }

    if (avatarFilePath) {
      const result = await cloudinary.uploader.upload(avatarFilePath, {
        folder: "user_avatars",
        use_filename: true,
        unique_filename: false,
      });
      user.avatar = result.secure_url;
      uploadedAvatar = result;
    }

    user.lastActive = Date.now();
    await user.save();

    await Audit.create({
      userId: user._id,
      type: "update_profile",
      ipAddress: req.ip || req.headers["x-forwarded-for"] || "Unknown",
      location: req.body.location || "Unknown",
      deviceInfo: req.headers["user-agent"] || "Unknown",
      refreshTokenHash: "",
      isRevoked: false,
    });

    const updatedUser = await User.findById(user._id).select(
      "-password -refreshTokenHash -twoFactorToken -mfaRecoveryCodes"
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  } finally {
    if (avatarFilePath) {
      try {
        await fs.unlink(avatarFilePath);
      } catch (err) {
        console.error("Failed to delete temp avatar file:", err.message);
      }
    }
  }
});

export const changePassword = CatchAsyncError(async (req, res, next) => {
  const userId = req.user?._id;
  if (!userId) return next(new ErrorHandler("Unauthorized access", 401));

  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return next(new ErrorHandler("All password fields are required", 400));
  }

  const user = await User.findById(userId).select("+password");
  if (!user) return next(new ErrorHandler("User not found", 404));

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch)
    return next(new ErrorHandler("Current password is incorrect", 400));

  if (!passwordRegex.test(newPassword)) {
    return next(
      new ErrorHandler(
        "Password must be at least 8 characters long, include uppercase, lowercase, and a number",
        400
      )
    );
  }

  if (newPassword !== confirmPassword) {
    return next(
      new ErrorHandler("New password and confirm password do not match", 400)
    );
  }

  user.password = newPassword;
  user.passwordChangedAt = Date.now();
  await user.save();

  await Audit.create({
    userId: user._id,
    type: "password_change",
    ipAddress: req.ip || req.headers["x-forwarded-for"] || "Unknown",
    location: req.body.location || "Unknown",
    deviceInfo: req.headers["user-agent"] || "Unknown",
    refreshTokenHash: "",
    isRevoked: false,
  });

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

// *************************** ADMIN API ******************************

export const getAllUsers = CatchAsyncError(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const search = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
          { phone: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const roleFilter = req.query.role ? { role: req.query.role } : {};

  const filters = { ...search, ...roleFilter, isDeleted: false };

  const users = await User.find(filters)
    .select("-password -refreshTokenHash -twoFactorToken -mfaRecoveryCodes")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalUsers = await User.countDocuments(filters);

  await Audit.create({
    userId: req.user._id,
    type: "get_all_users",
    ipAddress: req.ip || req.headers["x-forwarded-for"] || "Unknown",
    location: req.body.location || "Unknown",
    deviceInfo: req.headers["user-agent"] || "Unknown",
    refreshTokenHash: "",
    isRevoked: false,
  });

  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    page,
    limit,
    totalUsers,
    totalPages: Math.ceil(totalUsers / limit),
    users,
  });
});

export const blockUnblockUser = CatchAsyncError(async (req, res, next) => {
  const adminId = req.user?._id;
  const { role } = req.user || {};

  if (!adminId || !["admin", "super_admin"].includes(role)) {
    return next(new ErrorHandler("Unauthorized access", 403));
  }

  const userId = req.params.id;
  const { action } = req.body;

  if (!["block", "unblock"].includes(action)) {
    return next(
      new ErrorHandler("Invalid action. Must be 'block' or 'unblock'", 400)
    );
  }

  const user = await User.findById(userId);
  if (!user) return next(new ErrorHandler("User not found", 404));

  user.isBlocked = action === "block";
  await user.save();

  await Audit.create({
    userId: adminId,
    type: action === "block" ? "block_user" : "unblock_user",
    ipAddress: req.ip || req.headers["x-forwarded-for"] || "Unknown",
    location: req.body.location || "Unknown",
    deviceInfo: req.headers["user-agent"] || "Unknown",
    refreshTokenHash: "",
    isRevoked: false,
    meta: { affectedUserId: user._id, affectedUserEmail: user.email },
  });

  res.status(200).json({
    success: true,
    message: `User has been successfully ${action}ed.`,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isBlocked: user.isBlocked,
    },
  });
});

export const getAuditLogs = CatchAsyncError(async (req, res, next) => {
  const { role } = req.user || {};
  if (!["admin", "super_admin"].includes(role)) {
    return next(new ErrorHandler("Unauthorized access", 403));
  }

  const { page = 1, limit = 20, type, userId } = req.query;

  const query = {};
  if (type) query.type = type;
  if (userId) query.userId = userId;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const totalLogs = await Audit.countDocuments(query);

  const logs = await Audit.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    page: parseInt(page),
    limit: parseInt(limit),
    totalLogs,
    totalPages: Math.ceil(totalLogs / parseInt(limit)),
    logs,
  });
});
