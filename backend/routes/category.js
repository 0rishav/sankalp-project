import express from "express";
import { hasRole, isAuthenticated } from "../middlewares/auth.js";
import { upload } from "../utils/multerConfig.js";
import {
  createCategory,
  getAllCategories,
  getSingleCategory,
  hardDeleteCategory,
  softDeleteCategory,
  toggleCategoryActive,
  updateCategory,
} from "../controllers/category.js";

const categoryRouter = express.Router();

categoryRouter.post(
  "/create-category",
  isAuthenticated,
  hasRole("admin"),
  upload.single("icon"),
  createCategory
);

categoryRouter.get("/all-category", isAuthenticated, getAllCategories);

categoryRouter.put(
  "/update-category/:id",
  isAuthenticated,
  hasRole("admin"),
  upload.single("icon"),
  updateCategory
);

categoryRouter.get("/single-category/:id", isAuthenticated, getSingleCategory);

categoryRouter.patch("/toggle/:id", isAuthenticated, toggleCategoryActive);

categoryRouter.delete("/soft-delete/:id", isAuthenticated, softDeleteCategory);

categoryRouter.delete("/hard-delete/:id", isAuthenticated, hardDeleteCategory);

export default categoryRouter;
