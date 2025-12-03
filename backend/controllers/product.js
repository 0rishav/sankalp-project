import { CatchAsyncError } from "../middlewares/CatchAsyncError.js";
import Product from "../models/productModal.js";
import Review from "../models/reviewModal.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import fs from "fs/promises";

export const createProduct = CatchAsyncError(async (req, res, next) => {
  let {
    name,
    description,
    price,
    discountPrice,
    stock,
    lowStockAlert,
    category,
    brand,
    tags,
    variants,
    specifications,
    metaTitle,
    metaDescription,
  } = req.body;

  try {
    name = typeof name === "string" ? JSON.parse(name) : name;
    description =
      typeof description === "string" ? JSON.parse(description) : description;
    tags = typeof tags === "string" ? JSON.parse(tags) : tags || [];
    variants =
      typeof variants === "string" ? JSON.parse(variants) : variants || [];
    specifications =
      typeof specifications === "string"
        ? JSON.parse(specifications)
        : specifications || [];
  } catch (err) {
    console.error("JSON parse error:", err);
    return next(new ErrorHandler("Invalid JSON in request body", 400));
  }

  if (!name?.english || !name?.hindi || !price || !category) {
    return next(
      new ErrorHandler(
        "Name (english & hindi), price, and category are required",
        400
      )
    );
  }

  variants = variants.map((v, idx) => ({
    name: v.name || `Variant ${idx + 1}`,
    options: v.options || [],
    priceModifier: v.priceModifier || 0,
    stock: v.stock || 0,
  }));

  specifications = specifications.map((s) => ({
    key: s.key || "Key",
    value: s.value || "Value",
  }));

  let uploadedImages = [];

  try {
    if (req.files && req.files.images && req.files.images.length > 0) {
      for (const file of req.files.images) {
        console.log("Uploading file:", file.path);
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "product_images",
          resource_type: "image",
        });
        console.log("Uploaded result:", result);
        uploadedImages.push({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    const product = await Product.create({
      name: {
        english: name.english.trim(),
        hindi: name.hindi.trim(),
      },
      description: {
        english: description?.english?.trim() || "",
        hindi: description?.hindi?.trim() || "",
      },
      price,
      discountPrice,
      stock: stock || 0,
      lowStockAlert: lowStockAlert || 5,
      category,
      brand,
      tags,
      images: uploadedImages,
      variants,
      specifications,
      metaTitle,
      metaDescription,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return next(new ErrorHandler(error.message, 500));
  } finally {
    if (req.files && req.files.images && req.files.images.length > 0) {
      for (const file of req.files.images) {
        try {
          await fs.unlink(file.path);
          console.log("Deleted temp file:", file.path);
        } catch (err) {
          console.error("Failed to delete temp file:", err.message);
        }
      }
    }
  }
});

export const updateProduct = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let {
    name,
    description,
    price,
    discountPrice,
    stock,
    lowStockAlert,
    category,
    brand,
    tags,
    variants,
    specifications,
    metaTitle,
    metaDescription,
  } = req.body;

  const product = await Product.findById(id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  try {
    name = typeof name === "string" ? JSON.parse(name) : name;
    description =
      typeof description === "string" ? JSON.parse(description) : description;
    tags = typeof tags === "string" ? JSON.parse(tags) : tags || product.tags;
    variants =
      typeof variants === "string"
        ? JSON.parse(variants)
        : variants || product.variants;
    specifications =
      typeof specifications === "string"
        ? JSON.parse(specifications)
        : specifications || product.specifications;
  } catch (err) {
    console.error("JSON parse error:", err);
    return next(new ErrorHandler("Invalid JSON in request body", 400));
  }

  variants = variants.map((v, idx) => ({
    name: v.name || `Variant ${idx + 1}`,
    options: v.options || [],
    priceModifier: v.priceModifier || 0,
    stock: v.stock || 0,
  }));

  specifications = specifications.map((s) => ({
    key: s.key || "Key",
    value: s.value || "Value",
  }));

  let uploadedImages = [];

  try {
    console.log("Files received for update:", req.files);

    if (req.files && req.files.images && req.files.images.length > 0) {
      for (const file of req.files.images) {
        console.log("Uploading file:", file.path);
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "product_images",
          resource_type: "image",
        });
        console.log("Uploaded result:", result);
        uploadedImages.push({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }

      if (product.images && product.images.length > 0) {
        for (const img of product.images) {
          if (img.public_id) {
            await cloudinary.uploader.destroy(img.public_id);
            console.log("Deleted old image:", img.public_id);
          }
        }
      }

      product.images = uploadedImages;
    }

    if (name)
      product.name = {
        english: name.english?.trim() || product.name.english,
        hindi: name.hindi?.trim() || product.name.hindi,
      };
    if (description)
      product.description = {
        english: description?.english?.trim() || product.description.english,
        hindi: description?.hindi?.trim() || product.description.hindi,
      };
    if (price !== undefined) product.price = price;
    if (discountPrice !== undefined) product.discountPrice = discountPrice;
    if (stock !== undefined) product.stock = stock;
    if (lowStockAlert !== undefined) product.lowStockAlert = lowStockAlert;
    if (category) product.category = category;
    if (brand) product.brand = brand;
    if (tags) product.tags = tags;
    if (metaTitle !== undefined) product.metaTitle = metaTitle;
    if (metaDescription !== undefined)
      product.metaDescription = metaDescription;
    product.variants = variants;
    product.specifications = specifications;

    await product.save();

    console.log("Product updated:", product);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return next(new ErrorHandler(error.message, 500));
  } finally {
    if (req.files && req.files.images && req.files.images.length > 0) {
      for (const file of req.files.images) {
        try {
          await fs.unlink(file.path);
          console.log("Deleted temp file:", file.path);
        } catch (err) {
          console.error("Failed to delete temp file:", err.message);
        }
      }
    }
  }
});

export const getSingleProduct = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id)
    .populate("category", "name slug")
    .populate("brand", "name slug")
    .populate({
      path: "reviews",
      select: "userId rating title reviewContent isApproved createdAt",
      populate: { path: "userId", select: "name email" },
    });

  if (!product || product.isDeleted) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

export const getAllProducts = CatchAsyncError(async (req, res, next) => {
  let {
    page = 1,
    limit = 10,
    search = "",
    category,
    brand,
    minPrice,
    maxPrice,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  const skip = (page - 1) * limit;

  const query = { isDeleted: false };
  if (search) {
    query.$text = { $search: search };
  }
  if (category) query.category = category;
  if (brand) query.brand = brand;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

  const products = await Product.find(query)
    .populate("category", "name slug")
    .populate("brand", "name slug")
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  const totalProducts = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalProducts / limit);

  res.status(200).json({
    success: true,
    page,
    totalPages,
    totalProducts,
    products,
  });
});

export const searchProducts = CatchAsyncError(async (req, res, next) => {
  let {
    page = 1,
    limit = 10,
    search = "",
    category,
    brand,
    minPrice,
    maxPrice,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  const skip = (page - 1) * limit;

  const query = { isDeleted: false };

  if (search) {
    query.$text = { $search: search };
  }

  if (category) query.category = category;
  if (brand) query.brand = brand;

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

  const products = await Product.find(query)
    .populate("category", "name slug")
    .populate("brand", "name slug")
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  const totalProducts = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalProducts / limit);

  res.status(200).json({
    success: true,
    page,
    totalPages,
    totalProducts,
    products,
  });
});

export const softDeleteProduct = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  if (product.isDeleted) {
    return next(new ErrorHandler("Product already deleted", 400));
  }

  product.isDeleted = true;
  await product.save();

  res.status(200).json({
    success: true,
    message: "Product soft deleted successfully",
  });
});

export const hardDeleteProduct = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  if (product.images && product.images.length > 0) {
    for (const img of product.images) {
      try {
        await cloudinary.uploader.destroy(img.public_id);
      } catch (err) {
        console.error(
          `Failed to delete Cloudinary image ${img.public_id}:`,
          err.message
        );
      }
    }
  }

  await Product.deleteOne({ _id: id });

  res.status(200).json({
    success: true,
    message: "Product permanently deleted",
  });
});

export const toggleProductIsActive = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  product.isActive = !product.isActive;
  await product.save();

  res.status(200).json({
    success: true,
    message: `Product isActive set to ${product.isActive}`,
    product,
  });
});

export const toggleProductIsFeatured = CatchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return next(new ErrorHandler("Product not found", 404));

    product.isFeatured = !product.isFeatured;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product isFeatured set to ${product.isFeatured}`,
      product,
    });
  }
);

export const getProductsByCategory = CatchAsyncError(async (req, res, next) => {
  let {
    page = 1,
    limit = 10,
    search = "",
    minPrice,
    maxPrice,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  const skip = (page - 1) * limit;

  const { categoryId } = req.params;
  if (!categoryId)
    return next(new ErrorHandler("Category ID is required", 400));

  const query = { isDeleted: false, category: categoryId };
  if (search) query.$text = { $search: search };
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

  const products = await Product.find(query)
    .populate("category", "name slug")
    .populate("brand", "name slug")
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  const totalProducts = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalProducts / limit);

  res.status(200).json({
    success: true,
    page,
    totalPages,
    totalProducts,
    products,
  });
});

export const getProductsByBrand = CatchAsyncError(async (req, res, next) => {
  let {
    page = 1,
    limit = 10,
    search = "",
    minPrice,
    maxPrice,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  const skip = (page - 1) * limit;

  const { brandId } = req.params;
  if (!brandId) return next(new ErrorHandler("Brand ID is required", 400));

  const query = { isDeleted: false, brand: brandId };
  if (search) query.$text = { $search: search };
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

  const products = await Product.find(query)
    .populate("category", "name slug")
    .populate("brand", "name slug")
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  const totalProducts = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalProducts / limit);

  res.status(200).json({
    success: true,
    page,
    totalPages,
    totalProducts,
    products,
  });
});

export const getProductSummary = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id)
    .populate("category", "name slug")
    .populate("brand", "name slug");

  if (!product) return next(new ErrorHandler("Product not found", 404));

  const approvedReviews = await Review.find({
    productId: id,
    isApproved: true,
  });

  const totalReviews = approvedReviews.length;
  const averageRating =
    totalReviews === 0
      ? 0
      : (
          approvedReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
        ).toFixed(1);

  res.status(200).json({
    success: true,
    productId: product._id,
    name: product.name,
    stock: product.stock,
    lowStockAlert: product.lowStockAlert,
    totalReviews,
    averageRating: parseFloat(averageRating),
    category: product.category,
    brand: product.brand,
  });
});

export const updateProductStock = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let { stock } = req.body;

  stock = Number(stock);

  if (stock === undefined || isNaN(stock) || stock < 0) {
    return next(new ErrorHandler("Stock must be a non-negative number", 400));
  }

  const product = await Product.findById(id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  const totalVariantStock = product.variants.reduce((acc, v) => acc + v.stock, 0);

  if (stock < totalVariantStock) {
    const ratio = stock / totalVariantStock;
    product.variants = product.variants.map(v => ({
      ...v.toObject(),
      stock: Math.floor(v.stock * ratio),
    }));
  }

  product.stock = stock;
  await product.save();

  res.status(200).json({
    success: true,
    message: "Product stock updated successfully",
    stock: product.stock,
    variants: product.variants,
  });
});


export const updateProductPrice = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { price, discountPrice } = req.body;

  if (price === undefined || isNaN(price) || price < 0) {
    return next(new ErrorHandler("Price must be a non-negative number", 400));
  }

  if (
    discountPrice !== undefined &&
    (isNaN(discountPrice) || discountPrice < 0)
  ) {
    return next(
      new ErrorHandler("Discount price must be a non-negative number", 400)
    );
  }

  if (discountPrice !== undefined && discountPrice > price) {
    return next(
      new ErrorHandler("Discount price cannot be greater than price", 400)
    );
  }

  const product = await Product.findById(id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  product.price = price;
  if (discountPrice !== undefined) product.discountPrice = discountPrice;

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product price updated successfully",
    price: product.price,
    discountPrice: product.discountPrice,
  });
});

export const getTrendingProducts = CatchAsyncError(async (req, res, next) => {
  let { limit = 10 } = req.query;
  limit = parseInt(limit);

  const products = await Product.find({ isActive: true, isDeleted: false })
    .sort({ soldCount: -1, viewsCount: -1 })
    .limit(limit)
    .populate("category", "name slug")
    .populate("brand", "name slug");

  if (!products || products.length === 0) {
    return next(new ErrorHandler("No trending products found", 404));
  }

  res.status(200).json({
    success: true,
    total: products.length,
    products,
  });
});

export const getLowStockProducts = CatchAsyncError(async (req, res, next) => {
  let { limit = 20, page = 1 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  const skip = (page - 1) * limit;

  const products = await Product.find({
    isActive: true,
    isDeleted: false,
    stock: { $lt: "$lowStockAlert" },
  })
    .skip(skip)
    .limit(limit)
    .populate("category", "name slug")
    .populate("brand", "name slug");

  const total = await Product.countDocuments({
    isActive: true,
    isDeleted: false,
    stock: { $lt: "$lowStockAlert" },
  });

  res.status(200).json({
    success: true,
    page,
    totalPages: Math.ceil(total / limit),
    total,
    products,
  });
});
