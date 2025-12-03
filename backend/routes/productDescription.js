import express from "express";
import { hasRole, isAuthenticated } from "../middlewares/auth.js";
import {
  createProductDescription,
  getAllProductDescriptions,
  getSingleProductDescription,
  hardDeleteProductDescription,
  softDeleteProductDescription,
  toggleProductDescriptionActive,
  updateProductDescription,
  updateProductDescriptionMedia,
} from "../controllers/productDescription.js";
import { createUploadMiddleware } from "../utils/multerConfig.js";

const productDescriptionRouter = express.Router();

productDescriptionRouter.post(
  "/create-description",
  isAuthenticated,
  hasRole("admin"),
  createUploadMiddleware([{ name: "media", maxCount: 5 }]),
  createProductDescription
);

productDescriptionRouter.get(
  "/all-descriptions",
  isAuthenticated,
  hasRole("admin"),
  getAllProductDescriptions
);

productDescriptionRouter.put(
  "/update-description/:id",
  isAuthenticated,
  hasRole("admin"),
  createUploadMiddleware([{ name: "media", maxCount: 5 }]),
  updateProductDescription
);

productDescriptionRouter.get(
  "/single-description/:id",
  isAuthenticated,
  getSingleProductDescription
);

productDescriptionRouter.delete(
  "/soft-delete/:id",
  isAuthenticated,
  softDeleteProductDescription
);

productDescriptionRouter.delete(
  "/hard-delete/:id",
  isAuthenticated,
  hardDeleteProductDescription
);

productDescriptionRouter.patch(
  "/update-media/:id",
  isAuthenticated,
  hasRole("admin"),
  updateProductDescriptionMedia
);

export default productDescriptionRouter;
