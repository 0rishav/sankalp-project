import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    icon: {
      secure_url: { type: String },
      public_id: { type: String },
    },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String }],
  },
  { timestamps: true }
);

categorySchema.pre("validate", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

categorySchema.index({
  name: "text",
  slug: 1,
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
