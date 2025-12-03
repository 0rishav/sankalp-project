import express from "express";
import { hasRole, isAuthenticated } from "../middlewares/auth.js";
import { createUploadMiddleware } from "../utils/multerConfig.js";
import {
  approveReview,
  createReview,
  deleteReview,
  getAllReviews,
  getProductReviews,
  getProductReviewSummary,
  getReviewStatsSummary,
  getUnapprovedReviews,
  getUserReviews,
  hardDeleteReview,
  toggleHelpfulReview,
  updateReview,
  verifyReviewPurchase,
} from "../controllers/review.js";

const reviewRouter = express.Router();

reviewRouter.post(
  "/create",
  isAuthenticated,
  createUploadMiddleware([{ name: "media", maxCount: 5 }]),
  createReview
);

reviewRouter.get("/user-review", isAuthenticated, getUserReviews);

reviewRouter.get(
  "/all-review",
  isAuthenticated,
  hasRole("admin"),
  getAllReviews
);

reviewRouter.get("/all-review/:productId", isAuthenticated, getProductReviews);

reviewRouter.get(
  "/stats-summary",
  isAuthenticated,
  hasRole("admin"),
  getReviewStatsSummary
);

reviewRouter.get(
  "/unapproved-review",
  isAuthenticated,
  hasRole("admin"),
  getUnapprovedReviews
);

reviewRouter.get(
  "/product-review/:productId",
  isAuthenticated,
  hasRole("admin"),
  getProductReviewSummary
);

reviewRouter.patch("/helpful/:id", isAuthenticated, toggleHelpfulReview);

reviewRouter.put(
  "/update-review/:id",
  isAuthenticated,
  createUploadMiddleware([{ name: "media", maxCount: 5 }]),
  updateReview
);

reviewRouter.delete("/soft-delete/:id", isAuthenticated, deleteReview);

reviewRouter.patch(
  "/approve/:id",
  isAuthenticated,
  hasRole("admin"),
  approveReview
);

reviewRouter.patch(
  "/approve/:id",
  isAuthenticated,
  hasRole("admin"),
  approveReview
);

reviewRouter.patch(
  "/verify/:id",
  isAuthenticated,
  hasRole("admin"),
  verifyReviewPurchase
);

reviewRouter.delete(
  "/hard-delete/:id",
  isAuthenticated,
  hasRole("admin"),
  hardDeleteReview
);

export default reviewRouter;
