import mongoose from "mongoose";
import slugify from "slugify"

const imageSchema = new mongoose.Schema({
  secure_url: { type: String, required: true },
  public_id: { type: String, required: true },
});

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  options: [{ type: String, required: true }],
  priceModifier: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
});

const specificationSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      hindi: { type: String, required: true, trim: true },
      english: { type: String, required: true, trim: true },
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      default:"",
    },
    description: {
      hindi: { type: String },
      english: { type: String },
    },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    lowStockAlert: { type: Number, default: 5 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    tags: [{ type: String }],
    images: [imageSchema],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    wishlistedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },

    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String }],

    variants: [variantSchema],
    viewsCount: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
    specifications: [specificationSchema],
  },
  { timestamps: true }
);

productSchema.index({
  "name.english": "text",
  "name.hindi": "text",
  slug: 1,
});

productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });

productSchema.pre("save", async function (next) {
  if (this.discountPrice && this.discountPrice > this.price) {
    return next(
      new Error("Discount price cannot be greater than original price")
    );
  }

  const totalVariantStock = this.variants.reduce((acc, v) => acc + v.stock, 0);
  if (totalVariantStock > this.stock) {
    return next(
      new Error("Total stock of variants cannot exceed overall product stock")
    );
  }

  if (!this.slug || this.isModified("name.english")) {
    let baseSlug = slugify(this.name.english, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (await Product.exists({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }

  next();
});


const Product = mongoose.model("Product", productSchema);

export default Product;
