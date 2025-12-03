import { CatchAsyncError } from "../middlewares/CatchAsyncError.js";
import Category from "../models/categoryModal.js";
import Counter from "../models/counterModal.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const createCounter = CatchAsyncError(async (req, res, next) => {
  const { counterNumber, counterName, description, categories, location } =
    req.body;

  if (!counterNumber || !counterName) {
    return next(new ErrorHandler("Counter number and name are required", 400));
  }

  const existingCounter = await Counter.findOne({
    counterNumber,
    isDeleted: false,
  });

  if (existingCounter) {
    return next(new ErrorHandler("Counter number already exists", 400));
  }

  let validCategories = [];
  if (categories && categories.length > 0) {
    validCategories = await Category.find({
      _id: { $in: categories },
      isDeleted: false,
    });
    if (validCategories.length !== categories.length) {
      return next(
        new ErrorHandler("Some categories are invalid or deleted", 400)
      );
    }
  }

  const counter = await Counter.create({
    counterNumber,
    counterName,
    description,
    categories: validCategories.map((cat) => cat._id),
    location: location || "Main Store",
    createdBy: req.user?._id,
  });

  res.status(201).json({
    success: true,
    message: "Counter created successfully",
    data: counter,
  });
});

export const updateCounter = CatchAsyncError(async (req, res, next) => {
  const counterId = req.params.id;
  const { counterNumber, counterName, description, categories, location } =
    req.body;

  const counter = await Counter.findOne({ _id: counterId, isDeleted: false });
  if (!counter) {
    return next(new ErrorHandler("Counter not found", 404));
  }

  if (counterNumber && counterNumber !== counter.counterNumber) {
    const duplicate = await Counter.findOne({
      counterNumber,
      isDeleted: false,
    });
    if (duplicate) {
      return next(new ErrorHandler("Counter number already exists", 400));
    }
    counter.counterNumber = counterNumber;
  }

  if (counterName) counter.counterName = counterName;
  if (description) counter.description = description;
  if (location) counter.location = location;

  if (categories && categories.length > 0) {
    const validCategories = await Category.find({
      _id: { $in: categories },
      isDeleted: false,
    });
    if (validCategories.length !== categories.length) {
      return next(
        new ErrorHandler("Some categories are invalid or deleted", 400)
      );
    }
    counter.categories = validCategories.map((cat) => cat._id);
  }

  counter.updatedBy = req.user?._id;

  await counter.save();

  res.status(200).json({
    success: true,
    message: "Counter updated successfully",
    data: counter,
  });
});

export const getCounters = CatchAsyncError(async (req, res, next) => {
  let {
    page,
    limit,
    isActive,
    status,
    includeDeleted,
    search,
    sortBy,
    sortOrder,
  } = req.query;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const skip = (page - 1) * limit;

  const query = {};

  if (!includeDeleted || includeDeleted === "false") {
    query.isDeleted = false;
  }

  if (isActive === "true") query.isActive = true;
  if (isActive === "false") query.isActive = false;

  if (status) query.status = status;

  if (search) {
    query.counterName = { $regex: search, $options: "i" };
  }

  const sort = {};
  if (sortBy) {
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;
  } else {
    sort.counterNumber = 1;
  }

  const counters = await Counter.find(query)
    .populate({
      path: "categories",
      select: "name description",
    })
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Counter.countDocuments(query);

  res.status(200).json({
    success: true,
    page,
    totalPages: Math.ceil(total / limit),
    totalCounters: total,
    data: counters,
  });
});

export const getCounterById = CatchAsyncError(async (req, res, next) => {
  const counterId = req.params.id;

  const counter = await Counter.findOne({
    _id: counterId,
    isDeleted: false,
  }).populate({
    path: "categories",
    select: "name description",
  });

  if (!counter) {
    return next(new ErrorHandler("Counter not found", 404));
  }

  res.status(200).json({
    success: true,
    data: counter,
  });
});

export const updateCounterStatus = CatchAsyncError(async (req, res, next) => {
  const counterId = req.params.id;
  const { status } = req.body;

  const validStatuses = ["active", "inactive", "under_maintenance"];
  if (!status || !validStatuses.includes(status)) {
    return next(new ErrorHandler("Invalid or missing status", 400));
  }

  const counter = await Counter.findOne({ _id: counterId, isDeleted: false });
  if (!counter) return next(new ErrorHandler("Counter not found", 404));

  counter.status = status;
  counter.isActive = status === "active";
  counter.updatedBy = req.user?._id;

  await counter.save();

  res.status(200).json({
    success: true,
    message: "Counter status updated successfully",
    data: counter,
  });
});

export const toggleCounterActive = CatchAsyncError(async (req, res, next) => {
  const counterId = req.params.id;

  const counter = await Counter.findOne({ _id: counterId, isDeleted: false });
  if (!counter) return next(new ErrorHandler("Counter not found", 404));

  counter.isActive = !counter.isActive;
  counter.status = counter.isActive ? "active" : "inactive";
  counter.updatedBy = req.user?._id;

  await counter.save();

  res.status(200).json({
    success: true,
    message: `Counter is now ${counter.isActive ? "active" : "inactive"}`,
    data: counter,
  });
});

export const updateCounterCategories = CatchAsyncError(
  async (req, res, next) => {
    const counterId = req.params.id;
    const { categories } = req.body;

    if (!categories || !Array.isArray(categories)) {
      return next(new ErrorHandler("Categories must be an array", 400));
    }

    const counter = await Counter.findOne({ _id: counterId, isDeleted: false });
    if (!counter) return next(new ErrorHandler("Counter not found", 404));

    const validCategories = await Category.find({
      _id: { $in: categories },
      isDeleted: false,
    });
    if (validCategories.length !== categories.length) {
      return next(
        new ErrorHandler("Some categories are invalid or deleted", 400)
      );
    }

    counter.categories = validCategories.map((cat) => cat._id);
    counter.updatedBy = req.user?._id;

    await counter.save();

    res.status(200).json({
      success: true,
      message: "Counter categories updated successfully",
      data: counter,
    });
  }
);

export const softDeleteCounter = CatchAsyncError(async (req, res, next) => {
  const counterId = req.params.id;

  const counter = await Counter.findOne({ _id: counterId, isDeleted: false });
  if (!counter) return next(new ErrorHandler("Counter not found", 404));

  counter.isDeleted = true;
  counter.isActive = false;
  counter.updatedBy = req.user?._id;

  await counter.save();

  res.status(200).json({
    success: true,
    message: "Counter soft deleted successfully",
  });
});

export const restoreCounter = CatchAsyncError(async (req, res, next) => {
  const counterId = req.params.id;

  const counter = await Counter.findOne({ _id: counterId, isDeleted: true });
  if (!counter)
    return next(new ErrorHandler("Counter not found or not deleted", 404));

  counter.isDeleted = false;
  counter.isActive = true;
  counter.updatedBy = req.user?._id;

  await counter.save();

  res.status(200).json({
    success: true,
    message: "Counter restored successfully",
    data: counter,
  });
});

export const getCounterCategories = CatchAsyncError(async (req, res, next) => {
  const counterId = req.params.id;

  const counter = await Counter.findOne({
    _id: counterId,
    isDeleted: false,
  }).populate({
    path: "categories",
    select: "name description",
  });

  if (!counter) return next(new ErrorHandler("Counter not found", 404));

  res.status(200).json({
    success: true,
    data: counter.categories,
  });
});

export const hardDeleteCounter = CatchAsyncError(async (req, res, next) => {
  const counterId = req.params.id;

  const counter = await Counter.findById(counterId);
  if (!counter) return next(new ErrorHandler("Counter not found", 404));

  await counter.deleteOne();

  res.status(200).json({
    success: true,
    message: "Counter permanently deleted",
  });
});
