import express from "express";
import { hasRole, isAuthenticated } from "../middlewares/auth.js";
import { upload } from "../utils/multerConfig.js";
import {
  createBrand,
  getAllBrands,
  getSingleBrand,
  hardDeleteBrand,
  softDeleteBrand,
  toggleBrandStatus,
  updateBrand,
} from "../controllers/brand.js";

const brandRouter = express.Router();

brandRouter.post(
  "/create-brand",
  isAuthenticated,
  hasRole("admin"),
  upload.single("logo"),
  createBrand
);

brandRouter.get("/all-brand", isAuthenticated, getAllBrands);

brandRouter.put(
  "/update-brand/:id",
  isAuthenticated,
  hasRole("admin"),
  upload.single("logo"),
  updateBrand
);

brandRouter.get(
  "/single-brand/:id",
  isAuthenticated,
  hasRole("admin"),
  getSingleBrand
);

brandRouter.patch(
  "/toggle/:id",
  isAuthenticated,
  hasRole("admin"),
  toggleBrandStatus
);

brandRouter.delete(
  "/soft-delete/:id",
  isAuthenticated,
  hasRole("admin"),
  softDeleteBrand
);

brandRouter.delete(
  "/hard-delete/:id",
  isAuthenticated,
  hasRole("admin"),
  hardDeleteBrand
);

export default brandRouter;
