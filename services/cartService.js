const Product = require("../model/productModel");
const Cart = require("../model/cartModel");
const AppError = require("../utils/appError");

class CartService {
  constructor() {}
  /**
   * Add product to cart
   *
   * @param productId - ID of the product
   *
   * @param cartId - ID of the cart
   *
   * @return Promise <Cart>
   */
  async addProductToCart(productId, cartId) {
    // 1- Check if the product exists and is available
    const product = await Product.findById(productId);
    if (!product || product.quantity < 1) {
      throw AppError.notFound("The Product does not exist or is out of stock");
    }

    // 2- Check if the cart exists
    let cart = await Cart.findById(cartId);

    // 2.1- If cart does not exist, create a new cart or add the product to the cart if it already exists
    if (!cart) {
      cart = await Cart.create({
        cartItems: [
          {
            product: productId,
            quantity: 1,
            price: product.price,
            salePrice: product.salePrice,
          },
        ],
      });
    } else {
      const productIndex = cart.cartItems.findIndex(
        (item) => item.product.toString() === productId
      );
      if (productIndex > -1) {
        const cartItem = cart.cartItems[productIndex];
        // 2.2- Check if adding more quantity exceeds the available stock
        if (product.quantity < cartItem.quantity + 1) {
          throw AppError.notFound("Product quantity exceeds available stock");
        }
        cartItem.quantity += 1;
        cart.cartItems[productIndex] = cartItem;
      } else {
        // 2.3 - If the product is not in the cart, add it
        cart.cartItems.push({
          product: productId,
          quantity: 1,
          price: product.price,
          salePrice: product.salePrice,
        });
      }
    }

    // 3- Calculate the total price and total price after discount
    cart.calculateTotalPrices();

    // 4- Save the cart
    return await cart.save();
  }

  /**
   * Get all carts
   *
   * @returns Promise <Cart[]>
   */
  async getAllCarts() {
    return await Cart.find().populate("cartItems.product");
  }

  /**
   * Get cart by id
   *
   * @param id - ID of the cart
   * @returns Promise <Cart>
   */
  async getCartById(id) {
    const cart = await Cart.findById(id).populate("cartItems.product");

    if (!cart) {
      throw AppError.notFound("Cart not found");
    }
    return cart;
  }

  async updateCartItemQuantity(cartId, itemId, quantity) {
    // 1- Find the cart by ID and throw an error if it does not exist
    const cart = await this.getCartById(cartId);

    // 2- Check if the product exists in the cart
    const itemIndex = cart.cartItems.findIndex(
      (item) => item._id.toString() === itemId.toString()
    );

    if (itemIndex > -1) {
      const cartItem = cart.cartItems[itemIndex];
      const product = await Product.findById(cartItem.product);
      // 2.1- Check if the requested quantity is valid and available
      if (product.quantity < quantity || quantity < 0) {
        throw AppError.badRequest(
          `The quantity of ${product.name} is not available`
        );
      }
      cartItem.quantity = quantity;
      cart.cartItems[itemIndex] = cartItem;
    } else {
      throw AppError.notFound("No cart found for this id");
    }

    // 3- Calculate new total price
    cart.calculateTotalPrices();

    // 4- Save the cart
    await cart.save();

    // 5- Return the cart
    return cart;
  }

  /**
   * Delete product from cart by id
   *
   * @param id
   * @param cartId
   *
   * @returns Promise <Cart>
   */
  async deleteProductFromCart(productId, cartId) {
    // 1- Find the cart by ID
    let cart = await this.getCartById(cartId);

    // 2- Check if the product exists in the cart
    const cartItem = cart.cartItems.find(
      (item) => item.product._id.toString() === productId.toString()
    );

    if (!cartItem) {
      throw AppError.notFound("Product not found in the cart");
    }

    // 3- Use $pull to remove the product from cartItems
    cart = await Cart.findByIdAndUpdate(
      { _id: cartId },
      {
        $pull: {
          cartItems: { product: productId },
        },
      },
      { new: true, runValidators: true }
    ).populate("cartItems.product");

    // 4- Calculate new total price
    cart.calculateTotalPrices();

    // 5- Save and return the updated cart
    await cart.save();

    // 6- Return the updated cart
    return cart;
  }

  /**
   * Delete cart by id
   *
   * @param id
   * @returns Promise <null>
   */
  async deleteCartById(id) {
    const cart = await Cart.findByIdAndDelete(id);

    if (!cart) {
      throw AppError.notFound("Cart not found");
    }

    return null;
  }
}

const cartService = new CartService();

module.exports = cartService;
