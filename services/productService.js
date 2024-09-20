const Product = require("../model/productModel");
const AppError = require("../utils/appError");

class ProductService {
  /**
   * Create a new product
   *
   * @param {Object} product - Data of the product to be created like { name, quantity, image, price, salePrice is optional }
   *
   * @return {Promise<Product>}
   */
  async createProduct(product) {
      // 1- Create a new product
      return await Product.create(product);
  }

  /**
   * Get all products
   *
   * @return {Promise<Product[]>}
   */
  async getAllProducts() {
    // 1- Find all products
    return await Product.find();
  }

  /**
   * Get a product by ID
   *
   * @param {string} id - ID of the product
   *
   * @return {Promise<Product>}
   */
  async getProductById(id) {
    // 1- Find product by ID
    const product = await Product.findById(id);

    // 2- If product not found, throw error
    if (!product) {
      throw new AppError.notFound(`Product not found with id: ${id}`);
    }
    // -3 Return product
    return product;
  }

  /**
   * Update a product
   *
   * @param {string} id - ID of the product
   * @param {Object} productData - Data of the product to be updated like { name, quantity, image, price, salePrice if exists }
   *
   * @return {Promise<Product>}
   */
  async updateProduct(id, productData) {
    // 1- Find product by ID and update it
    const updatedProduct = await this.getProductById(id);

    Object.assign(updatedProduct, productData); // Update the product fields manually
    await updatedProduct.save();

    // 2- Return updated product
    return updatedProduct;
  }

  /**
   * Delete a product
   *
   * @param {string} id - ID of the product
   *
   * @return {Promise<null>}
   */
  async deleteProduct(id) {
    // 1- Find product by ID and delete it
    const deletedProduct = await Product.findByIdAndDelete(id);

    // 2- If product not found, throw error
    if (!deletedProduct) {
      throw new AppError.notFound(`Product not found with id: ${id}`);
    }

    // 3- Return null
    return null;
  }
}

const productService = new ProductService();
module.exports = productService;
