import { CatchAsyncError } from "../middlewares/CatchAsyncError.js";
import Category from "../models/categoryModal.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import fs from "fs/promises";

export const createCategory = CatchAsyncError(async (req, res, next) => {
  const {
    name,
    description,
    parentCategory,
    metaTitle,
    metaDescription,
    keywords,
  } = req.body;

  if (!name) {
    return next(new ErrorHandler("Name is required", 400));
  }

  const existingCategory = await Category.findOne({ name: name.trim() });
  if (existingCategory) {
    return next(
      new ErrorHandler("Category with this name already exists", 400)
    );
  }

  let iconData = null;

  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "category_icons",
        resource_type: "image",
      });
      iconData = {
        secure_url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const category = await Category.create({
      name: name.trim(),
      description,
      parentCategory: parentCategory || null,
      icon: iconData,
      metaTitle,
      metaDescription,
      keywords: keywords
        ? keywords
            .split(",")
            .map((k) => k.trim())
            .join(", ")
        : "",
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
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

export const updateCategory = CatchAsyncError(async (req, res, next) => {
  const {
    name,
    description,
    parentCategory,
    metaTitle,
    metaDescription,
    keywords,
  } = req.body;
  const categoryId = req.params.id;

  const category = await Category.findById(categoryId);
  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }

  if (name && name.trim() !== category.name) {
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory && existingCategory._id.toString() !== categoryId) {
      return next(
        new ErrorHandler("Category with this name already exists", 400)
      );
    }
    category.name = name.trim();
  }

  category.description = description ?? category.description;
  category.parentCategory = parentCategory ?? category.parentCategory;
  category.metaTitle = metaTitle ?? category.metaTitle;
  category.metaDescription = metaDescription ?? category.metaDescription;
  category.keywords = keywords ?? category.keywords;

  let newIconData = null;
  let oldIconPublicId = category.icon?.public_id;

  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "category_icons",
        resource_type: "image",
      });
      newIconData = {
        secure_url: result.secure_url,
        public_id: result.public_id,
      };
      category.icon = newIconData;

      if (oldIconPublicId) {
        await cloudinary.uploader.destroy(oldIconPublicId);
      }
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
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

export const getSingleCategory = CatchAsyncError(async (req, res, next) => {
  const categoryId = req.params.id;

  const category = await Category.findById(categoryId).populate(
    "parentCategory",
    "name slug"
  );

  if (!category || category.isDeleted) {
    return next(new ErrorHandler("Category not found", 404));
  }

  res.status(200).json({
    success: true,
    category,
  });
});

export const getAllCategories = CatchAsyncError(async (req, res, next) => {
  let {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    order = "desc",
    isActive,
  } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  const skip = (page - 1) * limit;

  const query = { isDeleted: false };

  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  if (search) {
    query.$text = { $search: search };
  }

  const totalCategories = await Category.countDocuments(query);

  const categories = await Category.find(query)
    .populate("parentCategory", "name slug")
    .sort({ [sortBy]: order === "desc" ? -1 : 1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    page,
    totalPages: Math.ceil(totalCategories / limit),
    totalCategories,
    categories,
  });
});

export const toggleCategoryActive = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) return next(new ErrorHandler("Category not found", 404));

  category.isActive = !category.isActive;
  await category.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: `Category has been ${
      category.isActive ? "activated" : "deactivated"
    }`,
    category: {
      _id: category._id,
      name: category.name,
      isActive: category.isActive,
    },
  });
});

export const softDeleteCategory = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) return next(new ErrorHandler("Category not found", 404));

  if (category.isDeleted) {
    return next(new ErrorHandler("Category is already deleted", 400));
  }

  category.isDeleted = true;
  await category.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Category soft deleted successfully",
  });
});

export const hardDeleteCategory = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) return next(new ErrorHandler("Category not found", 404));

  if (category.icon && category.icon.public_id) {
    try {
      await cloudinary.uploader.destroy(category.icon.public_id);
    } catch (err) {
      console.error("Cloudinary icon deletion failed:", err.message);
    }
  }

  await Category.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Category permanently deleted",
  });
});
