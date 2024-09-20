const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
        salePrice: Number,
      },
    ],
    totalCartPrice: Number,
    totalCartPriceAfterDiscount: Number,
  },
  { timestamps: true }
);


cartSchema.methods.calculateTotalPrices = function () {
  let totalPrice = 0;
  let  totalPriceAfterDiscount = 0;

  // 1- Loop through the cart items
this.cartItems.forEach((item) => {

    // 2- If the product has a sale price, use it; otherwise, use the regular price
    const effectivePrice = item.salePrice || item.price;

    // 3- Calculate Total price without discount (always use the original price)
    totalPrice += item.quantity *  item.price;

    // 4- Calculate Total price after discount (use sale price if available, otherwise fallback to regular price)
     totalPriceAfterDiscount += item.quantity * effectivePrice;
  });

  this.totalCartPrice = totalPrice;
  this.totalCartPriceAfterDiscount =  totalPriceAfterDiscount;

}


const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;