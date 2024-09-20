const express = require("express");
const productController = require("../controllers/productController");
const { uploadSingleImage } = require("../utils/uploadImage");
const {
  productValidation,
  productUpdateValidation,
} = require("../validations/productValidation");

const router = express.Router();

router
  .route("/")
  .post(
    uploadSingleImage("image"),
    productValidation,
    productController.createProduct
  )
  .get(productController.getAllProducts);

router
  .route("/:id")
  .get(productController.getProductById)
  .patch(
    uploadSingleImage("image"),
    productUpdateValidation,
    productController.updateProduct
  )
  .delete(productController.deleteProduct);

module.exports = router;
