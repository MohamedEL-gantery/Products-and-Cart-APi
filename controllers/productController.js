const asyncHandler = require('express-async-handler');
const ProductService = require('../services/productService');

class ProductController {
  constructor(ProductService) {
    this.productService = ProductService;
  }

  /** 
   * Create a new product
   * 
   * @returns The created product
   */
  createProduct = asyncHandler(async (req, res, next) => {
    if (req.file && req.file.filename) {
      req.body.image = req.file.filename;
    }

    const newProduct = await this.productService.createProduct(req.body);

    res.status(201).json({
      status: 'success',
      data: newProduct
    });
  });

  /**
   * Get all products
   *
   * @returns  list of all products
   */
  getAllProducts = asyncHandler(async (req, res, next) => {
    const products = await this.productService.getAllProducts();

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: products
    });
  });

  /**
   * Get a product by ID
   *
   * @returns  the product with the given ID
   */
  getProductById = asyncHandler(async (req, res, next) => {
    const product = await this.productService.getProductById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: product
    });
  });


  /**
   * Update a product
   *
   *@returns  the updated product
   */
  updateProduct = asyncHandler(async (req, res, next) => {
    // Check if there's an image to upload
    if (req.file && req.file.filename) {
      req.body.image = req.file.filename;
    }

    const updatedProduct = await this.productService.updateProduct(req.params.id, req.body);

    res.status(200).json({
      status: 'success',
      data: updatedProduct
    });
  });

  /**
   * Delete a product
   *
   * @returns  message
   */
  deleteProduct = asyncHandler(async (req, res, next) => {
    await this.productService.deleteProduct(req.params.id);

    res.status(204).json({
      status: 'success',
      message: "Product deleted successfully"
    });
  });
}

module.exports = new ProductController(ProductService);
