const mongoose = require('mongoose');
const Cart = require('./cartModel'); 

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product must have a name'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Product must have a quantity'],
    },
    image: {
      type: String,
      required: [true, 'Product must have an image'],
    },
    price: {
      type: Number,
      required: [true, 'Product must have a price'],
    },
    salePrice: {
      type: Number,
      validate: {
        validator: function (val) {
          return val == null || val < this.price;
        },
        message: 'Sale price ({VALUE}) should be lower than the regular price',
      },
    },
  
  },
  {
    timestamps: true, 
  }
);

productSchema.pre('save', async function (next) {
  if (
    this.isModified('name') ||
    this.isModified('image') ||
    this.isModified('price') ||
    this.isModified('salePrice')
  ) {
    const carts = await Cart.find({ 'cartItems.product': this._id });

    for (let cart of carts) {
      cart.cartItems.forEach((item) => {
        if (item.product.toString() === this._id.toString()) {
          console.log('Updating cart item for product:', this.name);
          item.name = this.name;
          item.image = this.image;
          item.price = this.price;
          item.salePrice = this.salePrice || null;
        }
      });

      cart.calculateTotalPrices();
      await cart.save();
    }
  }

  next();
});

const generateImageUrl = (doc) => {
  if (doc.image) {
    doc.image = `${process.env.BASE_URL}/uploads/${doc.image}`;
  }
};

productSchema.post('init', function (doc) {
  generateImageUrl(doc);
});

productSchema.post('save', function (doc) {
  generateImageUrl(doc);
});


const Product = mongoose.model('Product', productSchema);
module.exports = Product;
