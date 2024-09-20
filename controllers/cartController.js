const asyncHandler = require("express-async-handler");
const CartService = require("../services/cartService");

class CartController {
  constructor(CartService) {
    this.cartService = CartService;
  }

  /**
   * Add product to cart
   *
   *@returns Promise <Cart>
   */
  addProductToCart = asyncHandler(async (req, res, next) => {
    const { productId, cartId } = req.body;
    let cart;

    cartId
      ? (cart = await this.cartService.addProductToCart(productId, cartId))
      : (cart = await this.cartService.addProductToCart(productId));

    res.status(201).json({
      status: "success",
      data: cart,
    });
  });

  /**
   * Get all carts
   *
   * @returns Promise <Cart[]>
   */
  getAllCarts = asyncHandler(async (req, res, next) => {
    const carts = await this.cartService.getAllCarts();
    res.status(200).json({
      status: "success",
      results: carts.length,
      data: carts,
    });
  });

  /**
   * Get cart by id
   *
   * @returns Promise <Cart>
   */
  getCartById = asyncHandler(async (req, res, next) => {
    const cart = await this.cartService.getCartById(req.params.id);
    res.status(200).json({
      status: "success",
      data: cart,
    });
  });

  /**
   * Update cart item quantity
   *
   * @returns Promise <Cart>
   */
  updateCartItemQuantity = asyncHandler(async (req, res, next) => {
    const {itemId,cartId } = req.params;
    const { quantity } = req.body;
    const cart = await this.cartService.updateCartItemQuantity(
      cartId,
      itemId,
      quantity
    );
    res.status(200).json({
      status: "success",
      data: cart,
    });
  });

  /**
   * Delete product from cart by id
   *
   * @returns Promise <Cart>
   */
  deleteProductFromCart = asyncHandler(async (req, res, next) => {
    const { productId, cartId } = req.params;

    const cart = await this.cartService.deleteProductFromCart(productId, cartId);

    res.status(200).json({
      status: "success",
      data: cart,
    });
  });

  /**
   * Delete cart by id
   *
   * @returns Promise <null>
   */
  deleteCart = asyncHandler(async (req, res, next) => {
    await this.cartService.deleteCartById(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  });
}

const cartController = new CartController(CartService);

module.exports = cartController;
