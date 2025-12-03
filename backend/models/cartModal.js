import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true, default: 1, min: 1 },
    variant: { type: String },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    totalAmount: { type: Number, default: 0, min: 0 },
    totalDiscount: { type: Number, default: 0, min: 0 },
    appliedCoupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    appliedDiscountAmount: { type: Number, default: 0, min: 0 },
    appliedAt: { type: Date },

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

cartSchema.index({ userId: 1 });

cartSchema.methods.calculateTotals = function () {
  this.totalAmount = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  this.totalDiscount = this.items.reduce(
    (sum, item) => sum + (item.discountPrice || 0) * item.quantity,
    0
  );
  if (this.appliedCoupon && this.appliedDiscountAmount) {
    this.totalDiscount += this.appliedDiscountAmount;
  }
  return { totalAmount: this.totalAmount, totalDiscount: this.totalDiscount };
};

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
