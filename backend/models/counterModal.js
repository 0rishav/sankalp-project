import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
  {
    counterNumber: {
      type: Number,
      required: [true, "Counter number is required"],
      min: [1, "Counter number must be positive"],
    },

    counterName: {
      type: String,
      required: [true, "Counter name is required"],
      trim: true,
      minlength: [2, "Counter name must have at least 2 characters"],
      maxlength: [100, "Counter name too long"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],

    status: {
      type: String,
      enum: ["active", "inactive", "under_maintenance"],
      default: "active",
    },

    location: {
      type: String,
      trim: true,
      default: "Main Store",
    },

     isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

counterSchema.virtual("categoryCount").get(function () {
  return this.categories?.length || 0;
});

counterSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

counterSchema.pre("save", function (next) {
  if (this.isModified("categories")) {
    this.updatedAt = new Date();
  }
  next();
});

counterSchema.index({ counterNumber: 1, counterName: 1 });

const Counter = mongoose.model("Counter", counterSchema);
export default Counter;
