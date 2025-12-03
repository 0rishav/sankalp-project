import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  secure_url: { type: String, required: true },
  public_id: { type: String, required: true },
});

const productDescriptionSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
    },
    highlights: [{ type: String, trim: true }],
    productDescription: { type: String, trim: true },
    weight: { type: String, trim: true },
    volume: { type: String, trim: true },
    dimensions: { type: String, trim: true },
    material: { type: String, trim: true },
    color: { type: String, trim: true },
    flavour: { type: String, trim: true },
    scent: { type: String, trim: true },
    additionalInfo: { type: String, trim: true },
    media: [mediaSchema],
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productDescriptionSchema.index({ productId: 1 });

const ProductDescription = mongoose.model(
  "ProductDescription",
  productDescriptionSchema
);

export default ProductDescription;
