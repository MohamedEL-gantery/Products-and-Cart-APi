const express = require("express");
const cartController = require("../controllers/cartController");
const {
  createCartValidation,
  updateCartValidation,
} = require("../validations/cartValidation");

const router = express.Router();

router
  .route("/")
  .post(createCartValidation, cartController.addProductToCart)
  .get(cartController.getAllCarts);

router
  .route("/:productId/delete/:cartId")
  .patch(cartController.deleteProductFromCart);

router
  .route("/:itemId/update/:cartId")
  .patch(updateCartValidation, cartController.updateCartItemQuantity);

router
  .route("/:id")
  .get(cartController.getCartById)
  .delete(cartController.deleteCart);

module.exports = router;
