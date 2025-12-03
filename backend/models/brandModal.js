import mongoose from "mongoose";
import slugify from "slugify";

const brandSchema = new mongoose.Schema(
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

    logo: {
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

brandSchema.index({
  name: "text",
  slug: 1,
});

brandSchema.pre("validate", async function (next) {
  if (!this.slug && this.name) {
    let baseSlug = slugify(this.name, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;
    while (await Brand.exists({ slug })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }
    this.slug = slug;
  }
  next();
});

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
