const productService = require('../services/productService');

class ProductController {
  async getAll(req, res) {
    try {
      const products = await productService.getAllProducts();
      res.status(200).json({
        success: true,
        data: products
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getById(req, res) {
    try {
      const product = await productService.getProductById(req.params.id);
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      const statusCode = error.message === 'Product not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }

  async create(req, res) {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json({
        success: true,
        data: product
      });
    } catch (error) {
      // Always return 400 for create validation errors
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async update(req, res) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      let statusCode = 500;
      if (error.message === 'Product not found') {
        statusCode = 404;
      } else if (error.message === 'Category not found') {
        statusCode = 400;
      }

      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await productService.deleteProduct(req.params.id);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      const statusCode = error.message === 'Product not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }

  async getByCategory(req, res) {
    try {
      const products = await productService.getProductsByCategory(req.params.categoryId);
      res.status(200).json({
        success: true,
        data: products
      });
    } catch (error) {
      const statusCode = error.message === 'Category not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new ProductController();
