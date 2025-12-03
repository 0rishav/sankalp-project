import express from "express";
import { hasRole, isAuthenticated } from "../middlewares/auth.js";
import {
  createProduct,
  getAllProducts,
  getLowStockProducts,
  getProductsByBrand,
  getProductsByCategory,
  getProductSummary,
  getSingleProduct,
  getTrendingProducts,
  hardDeleteProduct,
  searchProducts,
  softDeleteProduct,
  toggleProductIsActive,
  toggleProductIsFeatured,
  updateProduct,
  updateProductPrice,
  updateProductStock,
} from "../controllers/product.js";
import { createUploadMiddleware } from "../utils/multerConfig.js";

const productRouter = express.Router();

productRouter.post(
  "/create-product",
  isAuthenticated,
  hasRole("admin"),
  createUploadMiddleware([{ name: "images", maxCount: 5 }]),
  createProduct
);

productRouter.get("/all-product", isAuthenticated, getAllProducts);

productRouter.get("/search", isAuthenticated, searchProducts);

productRouter.get("/trending-product", isAuthenticated, getTrendingProducts);

productRouter.get(
  "/lowStock-product",
  isAuthenticated,
  hasRole("admin"),
  getLowStockProducts
);

productRouter.put(
  "/update-product/:id",
  isAuthenticated,
  hasRole("admin"),
  createUploadMiddleware([{ name: "images", maxCount: 5 }]),
  updateProduct
);

productRouter.get("/single-product/:id", isAuthenticated, getSingleProduct);

productRouter.get(
  "/product-by-category/:categoryId",
  isAuthenticated,
  getProductsByCategory
);

productRouter.get(
  "/product-by-brand/:brandId",
  isAuthenticated,
  getProductsByBrand
);

productRouter.get(
  "/product-summary/:id",
  isAuthenticated,
  hasRole("admin"),
  getProductSummary
);

productRouter.patch(
  "/update-stock/:id",
  isAuthenticated,
  hasRole("admin"),
  updateProductStock
);

productRouter.patch(
  "/update-price/:id",
  isAuthenticated,
  hasRole("admin"),
  updateProductPrice
);

productRouter.delete(
  "/soft-delete/:id",
  isAuthenticated,
  hasRole("admin"),
  softDeleteProduct
);

productRouter.delete(
  "/hard-delete/:id",
  isAuthenticated,
  hasRole("admin"),
  hardDeleteProduct
);

productRouter.patch(
  "/toggle-active/:id",
  isAuthenticated,
  hasRole("admin"),
  toggleProductIsActive
);

productRouter.patch(
  "/toggle-featured/:id",
  isAuthenticated,
  hasRole("admin"),
  toggleProductIsFeatured
);

export default productRouter;
