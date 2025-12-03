import express from "express";
import {
  activateUser,
  blockUnblockUser,
  changePassword,
  generateResetPasswordToken,
  getAllUsers,
  getAuditLogs,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registrationUser,
  resetPassword,
  updateUserProfile,
} from "../controllers/user.js";
import { hasRole, isAuthenticated } from "../middlewares/auth.js";
import { upload } from "../utils/multerConfig.js";

const userRouter = express.Router();

//user api

userRouter.post("/register", registrationUser);

userRouter.post("/activate-user", activateUser);

userRouter.post("/login", loginUser);

userRouter.post("/logout", isAuthenticated, logoutUser);

userRouter.post("/refresh-token", refreshAccessToken);

userRouter.get("/me", isAuthenticated, getCurrentUser);

userRouter.post("/generate-reset-token", generateResetPasswordToken);

userRouter.post("/new-password", resetPassword);

userRouter.patch(
  "/edit-profile",
  upload.single("avatar"),
  isAuthenticated,
  updateUserProfile
);

userRouter.patch("/change-password", isAuthenticated, changePassword);

// Admin API

userRouter.get("/all-users", isAuthenticated, hasRole("admin"), getAllUsers);

userRouter.patch(
  "/block-unblock",
  isAuthenticated,
  hasRole("admin"),
  blockUnblockUser
);

userRouter.get("/audit-log", isAuthenticated, hasRole("admin"), getAuditLogs);

export default userRouter;
