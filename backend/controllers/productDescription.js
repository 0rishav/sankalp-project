import { CatchAsyncError } from "../middlewares/CatchAsyncError.js";
import ProductDescription from "../models/productDescriptionModal.js";
import Product from "../models/productModal.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import fs from "fs/promises";

export const createProductDescription = CatchAsyncError(
  async (req, res, next) => {
    let {
      productId,
      highlights,
      productDescription,
      weight,
      volume,
      dimensions,
      material,
      color,
      flavour,
      scent,
      additionalInfo,
    } = req.body;

    if (!productId) {
      return next(new ErrorHandler("productId is required", 400));
    }

    const product = await Product.findById(productId);
    if (!product) return next(new ErrorHandler("Product not found", 404));

    const existing = await ProductDescription.findOne({ productId });
    if (existing) {
      return next(new ErrorHandler("Product description already exists", 400));
    }

    try {
      highlights =
        typeof highlights === "string"
          ? JSON.parse(highlights)
          : highlights || [];
    } catch (err) {
      return next(new ErrorHandler("Invalid JSON in highlights", 400));
    }

    let mediaArray = [];

    try {
      if (req.files && req.files.media && req.files.media.length > 0) {
        for (const file of req.files.media) {
          console.log("Uploading file:", file.path);
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "product_description_media",
            resource_type: "image",
          });
          console.log("Uploaded result:", result);
          mediaArray.push({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      }

      const productDesc = await ProductDescription.create({
        productId,
        highlights,
        productDescription,
        weight,
        volume,
        dimensions,
        material,
        color,
        flavour,
        scent,
        additionalInfo,
        media: mediaArray,
      });

      res.status(201).json({
        success: true,
        message: "Product description created successfully",
        productDescription: productDesc,
      });
    } catch (error) {
      console.error("Error creating product description:", error);
      return next(new ErrorHandler(error.message, 500));
    } finally {
      if (req.files && req.files.media && req.files.media.length > 0) {
        for (const file of req.files.media) {
          try {
            await fs.unlink(file.path);
            console.log("Deleted temp file:", file.path);
          } catch (err) {
            console.error("Failed to delete temp file:", err.message);
          }
        }
      }
    }
  }
);

export const updateProductDescription = CatchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;
    let {
      highlights,
      productDescription,
      weight,
      volume,
      dimensions,
      material,
      color,
      flavour,
      scent,
      additionalInfo,
    } = req.body;

    const productDesc = await ProductDescription.findById(id);
    if (!productDesc)
      return next(new ErrorHandler("Product description not found", 404));

    let newMediaArray = [];

    try {
      if (highlights && typeof highlights === "string") {
        highlights = JSON.parse(highlights);
      }

      if (req.files && req.files.media && req.files.media.length > 0) {
        for (const file of req.files.media) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "product_description_media",
            resource_type: "image",
          });
          newMediaArray.push({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }

        if (productDesc.media && productDesc.media.length > 0) {
          for (const media of productDesc.media) {
            if (media.public_id) {
              await cloudinary.uploader.destroy(media.public_id);
            }
          }
        }

        productDesc.media = newMediaArray;
      }

      if (highlights) productDesc.highlights = highlights;
      if (productDescription)
        productDesc.productDescription = productDescription;
      if (weight) productDesc.weight = weight;
      if (volume) productDesc.volume = volume;
      if (dimensions) productDesc.dimensions = dimensions;
      if (material) productDesc.material = material;
      if (color) productDesc.color = color;
      if (flavour) productDesc.flavour = flavour;
      if (scent) productDesc.scent = scent;
      if (additionalInfo) productDesc.additionalInfo = additionalInfo;

      await productDesc.save();

      res.status(200).json({
        success: true,
        message: "Product description updated successfully",
        productDescription: productDesc,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    } finally {
      if (req.files && req.files.media && req.files.media.length > 0) {
        for (const file of req.files.media) {
          try {
            await fs.unlink(file.path);
            console.log("Deleted temp file:", file.path);
          } catch (err) {
            console.error("Failed to delete temp file:", err.message);
          }
        }
      }
    }
  }
);

export const getSingleProductDescription = CatchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;

    const productDesc = await ProductDescription.findById(id).populate(
      "productId",
      "name slug"
    );
    if (!productDesc)
      return next(new ErrorHandler("Product description not found", 404));

    res.status(200).json({
      success: true,
      productDescription: productDesc,
    });
  }
);

export const getAllProductDescriptions = CatchAsyncError(
  async (req, res, next) => {
    let { page = 1, limit = 10, isActive } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };
    if (isActive !== undefined) query.isActive = isActive === "true";

    const total = await ProductDescription.countDocuments(query);

    const descriptions = await ProductDescription.find(query)
      .populate("productId", "name slug")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      page,
      totalPages,
      total,
      descriptions,
    });
  }
);

export const softDeleteProductDescription = CatchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;

    const productDesc = await ProductDescription.findById(id);
    if (!productDesc)
      return next(new ErrorHandler("Product description not found", 404));

    productDesc.isDeleted = true;
    await productDesc.save();

    res.status(200).json({
      success: true,
      message: "Product description soft deleted successfully",
    });
  }
);

export const hardDeleteProductDescription = CatchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;

    const productDesc = await ProductDescription.findById(id);
    if (!productDesc)
      return next(new ErrorHandler("Product description not found", 404));

    if (productDesc.media && productDesc.media.length > 0) {
      for (const media of productDesc.media) {
        try {
          await cloudinary.uploader.destroy(media.public_id, {
            resource_type: "image",
          });
        } catch (err) {
          console.error("Failed to delete media from Cloudinary:", err.message);
        }
      }
    }

    await productDesc.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product description permanently deleted",
    });
  }
);

export const toggleProductDescriptionActive = CatchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;

    const productDesc = await ProductDescription.findById(id);
    if (!productDesc)
      return next(new ErrorHandler("Product description not found", 404));

    productDesc.isActive = !productDesc.isActive;
    await productDesc.save();

    res.status(200).json({
      success: true,
      message: `Product description ${
        productDesc.isActive ? "activated" : "deactivated"
      } successfully`,
      isActive: productDesc.isActive,
    });
  }
);

export const updateProductDescriptionMedia = CatchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;
    const { removeMediaIds } = req.body;

    const productDesc = await ProductDescription.findById(id);
    if (!productDesc)
      return next(new ErrorHandler("Product description not found", 404));

    let addedMedia = [];

    try {
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "product_description_media",
            resource_type: "image",
          });
          addedMedia.push({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
        productDesc.media.push(...addedMedia);
      }

      if (removeMediaIds && Array.isArray(removeMediaIds)) {
        for (const public_id of removeMediaIds) {
          await cloudinary.uploader.destroy(public_id);
          productDesc.media = productDesc.media.filter(
            (m) => m.public_id !== public_id
          );
        }
      }

      await productDesc.save();

      res.status(200).json({
        success: true,
        message: "Media updated successfully",
        media: productDesc.media,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    } finally {
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          try {
            await fs.unlink(file.path);
          } catch (err) {
            console.error("Failed to delete temp file:", err.message);
          }
        }
      }
    }
  }
);
