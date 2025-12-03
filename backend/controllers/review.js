import { CatchAsyncError } from "../middlewares/CatchAsyncError.js";
import Product from "../models/productModal.js";
import Review from "../models/reviewModal.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import fs from "fs/promises";

export const createReview = CatchAsyncError(async (req, res, next) => {
  const { productId, rating, title, reviewContent } = req.body;
  const userId = req.user?._id;

  if (!productId || !rating) {
    return next(new ErrorHandler("Product ID and rating are required", 400));
  }

  if (rating < 1 || rating > 5) {
    return next(new ErrorHandler("Rating must be between 1 and 5", 400));
  }

  const product = await Product.findById(productId);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  const existingReview = await Review.findOne({ productId, userId });
  if (existingReview) {
    return next(
      new ErrorHandler("You have already reviewed this product", 400)
    );
  }

  let uploadedMedia = [];

  try {
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "review_media",
          resource_type: "image",
        });
        uploadedMedia.push({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    const review = await Review.create({
      productId,
      userId,
      rating,
      title: title?.trim(),
      reviewContent,
      media: uploadedMedia,
    });

    product.reviews.push(review._id);

    const approvedReviews = await Review.find({ productId, isApproved: true });
    const totalReviews = approvedReviews.length + 1;
    const totalRating =
      approvedReviews.reduce((sum, r) => sum + r.rating, 0) + rating;

    product.averageRating = (totalRating / totalReviews).toFixed(1);
    product.totalReviews = totalReviews;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
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
});

export const getProductReviews = CatchAsyncError(async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  const reviews = await Review.find({ productId, isApproved: true })
    .populate("userId", "name avatar")
    .sort({ createdAt: -1 });

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews === 0
      ? 0
      : (
          reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
        ).toFixed(1);

  res.status(200).json({
    success: true,
    product: {
      _id: product._id,
      name: product.name,
      slug: product.slug,
      averageRating,
      totalReviews,
    },
    reviews,
  });
});

export const getUserReviews = CatchAsyncError(async (req, res, next) => {
  const userId = req.user?._id;

  if (!userId) {
    return next(new ErrorHandler("User not authenticated", 401));
  }

  const reviews = await Review.find({ userId })
    .populate({
      path: "productId",
      select: "name slug images",
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    totalReviews: reviews.length,
    reviews,
  });
});

export const toggleHelpfulReview = CatchAsyncError(async (req, res, next) => {
  const reviewId = req.params.id;
  const userId = req.user?._id;

  if (!userId) return next(new ErrorHandler("User not authenticated", 401));

  const review = await Review.findById(reviewId);
  if (!review) return next(new ErrorHandler("Review not found", 404));

  if (!review.helpfulBy) review.helpfulBy = [];

  const index = review.helpfulBy.findIndex(
    (id) => id.toString() === userId.toString()
  );

  if (index === -1) {
    review.helpfulCount += 1;
    review.helpfulBy.push(userId);
    await review.save();
    return res.status(200).json({
      success: true,
      message: "Marked as helpful",
      helpfulCount: review.helpfulCount,
    });
  } else {
    review.helpfulCount -= 1;
    review.helpfulBy.splice(index, 1);
    await review.save();
    return res.status(200).json({
      success: true,
      message: "Unmarked as helpful",
      helpfulCount: review.helpfulCount,
    });
  }
});

export const updateReview = CatchAsyncError(async (req, res, next) => {
  const reviewId = req.params.id;
  const userId = req.user?._id;
  const { rating, title, reviewContent } = req.body;

  const review = await Review.findById(reviewId);
  if (!review) return next(new ErrorHandler("Review not found", 404));

  if (review.userId.toString() !== userId.toString()) {
    return next(new ErrorHandler("You can only update your own review", 403));
  }

  let uploadedMedia = [];

  try {
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "review_media",
          resource_type: "image",
        });
        uploadedMedia.push({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }

      if (review.media && review.media.length > 0) {
        for (const m of review.media) {
          if (m.public_id) {
            await cloudinary.uploader.destroy(m.public_id);
          }
        }
      }
    }

    review.rating = rating ?? review.rating;
    review.title = title?.trim() ?? review.title;
    review.reviewContent = reviewContent ?? review.reviewContent;
    if (uploadedMedia.length > 0) review.media = uploadedMedia;

    await review.save();

    const product = await Product.findById(review.productId);
    if (product) {
      const approvedReviews = await Review.find({
        productId: product._id,
        isApproved: true,
      });
      const totalReviews = approvedReviews.length;
      const avgRating =
        totalReviews === 0
          ? 0
          : approvedReviews.reduce((acc, r) => acc + r.rating, 0) /
            totalReviews;
      product.averageRating = avgRating.toFixed(1);
      product.totalReviews = totalReviews;
      await product.save();
    }

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
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
});

export const deleteReview = CatchAsyncError(async (req, res, next) => {
  const reviewId = req.params.id;
  const userId = req.user?._id;
  const userRole = req.user?.role;

  const review = await Review.findById(reviewId);
  if (!review) return next(new ErrorHandler("Review not found", 404));

  const editWindowMs = 24 * 60 * 60 * 1000;
  const withinWindow = Date.now() - review.createdAt.getTime() < editWindowMs;

  if (userRole !== "admin" && review.userId.toString() !== userId.toString()) {
    return next(new ErrorHandler("You can only delete your own review", 403));
  }

  if (
    review.userId.toString() === userId.toString() &&
    !withinWindow &&
    userRole !== "admin"
  ) {
    return next(
      new ErrorHandler("Edit window expired. Contact admin to delete.", 403)
    );
  }

  review.isDeleted = true;
  await review.save();

  const product = await Product.findById(review.productId);
  if (product) {
    const approvedReviews = await Review.find({
      productId: product._id,
      isApproved: true,
      isDeleted: false,
    });
    const totalReviews = approvedReviews.length;
    const avgRating =
      totalReviews === 0
        ? 0
        : approvedReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;
    product.averageRating = avgRating.toFixed(1);
    product.totalReviews = totalReviews;
    await product.save();
  }

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});

export const getAllReviews = CatchAsyncError(async (req, res, next) => {
  let {
    page = 1,
    limit = 10,
    productId,
    userId,
    isApproved,
    search,
    sortBy,
    sortOrder,
  } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  const skip = (page - 1) * limit;

  const filter = {};

  if (productId) filter.productId = productId;
  if (userId) filter.userId = userId;
  if (isApproved !== undefined) filter.isApproved = isApproved === "true";

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { "reviewContent.english": { $regex: search, $options: "i" } },
      { "reviewContent.hindi": { $regex: search, $options: "i" } },
    ];
  }

  let sort = { createdAt: -1 };
  if (sortBy) {
    const order = sortOrder === "asc" ? 1 : -1;
    sort = { [sortBy]: order };
  }

  const totalReviews = await Review.countDocuments(filter);
  const reviews = await Review.find(filter)
    .populate("userId", "name avatar email")
    .populate("productId", "name slug")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    total: totalReviews,
    page,
    pages: Math.ceil(totalReviews / limit),
    reviews,
  });
});

export const approveReview = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { approve } = req.body;

  const review = await Review.findById(id);
  if (!review) return next(new ErrorHandler("Review not found", 404));

  review.isApproved = !!approve;
  await review.save();

  if (approve) {
    const product = await Product.findById(review.productId);
    const approvedReviews = await Review.find({
      productId: product._id,
      isApproved: true,
    });
    const totalReviews = approvedReviews.length;
    const avgRating =
      totalReviews === 0
        ? 0
        : approvedReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;

    product.averageRating = avgRating.toFixed(1);
    product.totalReviews = totalReviews;
    await product.save();
  }

  res.status(200).json({
    success: true,
    message: `Review has been ${approve ? "approved" : "rejected"}`,
    review,
  });
});

export const verifyReviewPurchase = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findById(id);
  if (!review) return next(new ErrorHandler("Review not found", 404));

  review.isVerifiedPurchase = true;
  await review.save();

  res.status(200).json({
    success: true,
    message: "Review marked as verified purchase",
    review,
  });
});

export const hardDeleteReview = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findById(id);
  if (!review) return next(new ErrorHandler("Review not found", 404));

  try {
    if (review.media && review.media.length > 0) {
      for (const file of review.media) {
        if (file.public_id) {
          await cloudinary.uploader.destroy(file.public_id, {
            resource_type: "image",
          });
        }
      }
    }

    const product = await Product.findById(review.productId);
    if (product) {
      product.reviews = product.reviews.filter(
        (rid) => rid.toString() !== review._id.toString()
      );

      const approvedReviews = await Review.find({
        productId: product._id,
        isApproved: true,
        _id: { $ne: review._id },
      });
      const totalReviews = approvedReviews.length;
      const avgRating =
        totalReviews === 0
          ? 0
          : approvedReviews.reduce((acc, r) => acc + r.rating, 0) /
            totalReviews;

      product.averageRating = avgRating.toFixed(1);
      product.totalReviews = totalReviews;
      await product.save();
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: "Review permanently deleted",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const getReviewStatsSummary = CatchAsyncError(async (req, res, next) => {
  const ratingBuckets = await Review.aggregate([
    { $match: { isApproved: true } },
    {
      $group: {
        _id: "$rating",
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: -1 } },
  ]);

  const avgRatingPerProduct = await Review.aggregate([
    { $match: { isApproved: true } },
    {
      $group: {
        _id: "$productId",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $project: {
        productId: "$_id",
        productName: "$product.name.english",
        averageRating: { $round: ["$averageRating", 1] },
        totalReviews: 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    ratingBuckets,
    avgRatingPerProduct,
  });
});

export const getUnapprovedReviews = CatchAsyncError(async (req, res, next) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const skip = (page - 1) * limit;

  const filter = { isApproved: false };

  if (search) {
    const products = await Product.find({
      "name.english": { $regex: search, $options: "i" },
    }).select("_id");
    const productIds = products.map((p) => p._id);
    filter.productId = { $in: productIds };
  }

  const total = await Review.countDocuments(filter);
  const reviews = await Review.find(filter)
    .populate("userId", "name email avatar")
    .populate("productId", "name.english slug")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    page: Number(page),
    limit: Number(limit),
    total,
    reviews,
  });
});

export const getProductReviewSummary = CatchAsyncError(
  async (req, res, next) => {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) return next(new ErrorHandler("Product not found", 404));

    const aggregation = await Review.aggregate([
      { $match: { productId: product._id, isApproved: true } },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    aggregation.forEach((item) => {
      ratingBreakdown[item._id] = item.count;
    });

    const totalReviews = Object.values(ratingBreakdown).reduce(
      (a, b) => a + b,
      0
    );
    const averageRating =
      totalReviews === 0
        ? 0
        : (
            Object.entries(ratingBreakdown).reduce(
              (sum, [star, count]) => sum + star * count,
              0
            ) / totalReviews
          ).toFixed(1);

    res.status(200).json({
      success: true,
      productId: product._id,
      productName: product.name.english,
      totalReviews,
      averageRating: Number(averageRating),
      ratingBreakdown,
    });
  }
);
