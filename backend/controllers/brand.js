import { CatchAsyncError } from "../middlewares/CatchAsyncError.js";
import Brand from "../models/brandModal.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import fs from "fs/promises";

export const createBrand = CatchAsyncError(async (req, res, next) => {
  const { name, description, metaTitle, metaDescription, keywords } = req.body;

  if (!name) {
    return next(new ErrorHandler("Brand name is required", 400));
  }

  const existingBrand = await Brand.findOne({ name: name.trim() });
  if (existingBrand) {
    return next(new ErrorHandler("Brand with this name already exists", 400));
  }

  let logoData = null;

  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "brand_logos",
        resource_type: "image",
      });

      logoData = {
        secure_url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const brand = await Brand.create({
      name: name.trim(),
      description,
      logo: logoData,
      metaTitle,
      metaDescription,
      keywords: keywords
        ? keywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k)
            .join(", ")
        : "",
    });

    res.status(201).json({
      success: true,
      message: "Brand created successfully",
      brand,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  } finally {
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (err) {
        console.error("Failed to delete temp file:", err.message);
      }
    }
  }
});

export const updateBrand = CatchAsyncError(async (req, res, next) => {
  const { name, description, metaTitle, metaDescription, keywords } = req.body;
  const { id } = req.params;

  const brand = await Brand.findById(id);
  if (!brand) return next(new ErrorHandler("Brand not found", 404));

  let newLogoData = null;

  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "brand_logos",
        resource_type: "image",
      });
      newLogoData = {
        secure_url: result.secure_url,
        public_id: result.public_id,
      };

      if (brand.logo && brand.logo.public_id) {
        await cloudinary.uploader.destroy(brand.logo.public_id);
      }
    }

    brand.name = name?.trim() || brand.name;
    brand.description = description || brand.description;
    brand.metaTitle = metaTitle || brand.metaTitle;
    brand.metaDescription = metaDescription || brand.metaDescription;
    brand.keywords = keywords || brand.keywords;
    if (newLogoData) brand.logo = newLogoData;

    await brand.save();

    res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      brand,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  } finally {
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (err) {
        console.error("Failed to delete temp file:", err.message);
      }
    }
  }
});

export const getSingleBrand = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const brand = await Brand.findById(id);
  if (!brand || brand.isDeleted) {
    return next(new ErrorHandler("Brand not found", 404));
  }

  res.status(200).json({
    success: true,
    brand,
  });
});

export const getAllBrands = CatchAsyncError(async (req, res, next) => {
  let { page = 1, limit = 10, search, isActive } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  const filter = { isDeleted: false };
  if (isActive !== undefined) filter.isActive = isActive === "true";
  if (search) {
    filter.$text = { $search: search };
  }

  const totalBrands = await Brand.countDocuments(filter);
  const brands = await Brand.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    page,
    limit,
    totalBrands,
    totalPages: Math.ceil(totalBrands / limit),
    brands,
  });
});

export const toggleBrandStatus = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const brand = await Brand.findById(id);
  if (!brand || brand.isDeleted) {
    return next(new ErrorHandler("Brand not found or has been deleted", 404));
  }

  brand.isActive = !brand.isActive;
  await brand.save();

  res.status(200).json({
    success: true,
    message: `Brand ${
      brand.isActive ? "activated" : "deactivated"
    } successfully`,
    brand,
  });
});

export const softDeleteBrand = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const brand = await Brand.findById(id);
  if (!brand || brand.isDeleted) {
    return next(new ErrorHandler("Brand not found or already deleted", 404));
  }

  brand.isDeleted = true;
  brand.isActive = false;

  await brand.save();

  res.status(200).json({
    success: true,
    message: "Brand soft-deleted successfully",
  });
});

export const hardDeleteBrand = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const brand = await Brand.findById(id);
  if (!brand) {
    return next(new ErrorHandler("Brand not found", 404));
  }

  try {
    if (brand.logo && brand.logo.public_id) {
      await cloudinary.uploader.destroy(brand.logo.public_id);
    }

    await Brand.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Brand permanently deleted",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
