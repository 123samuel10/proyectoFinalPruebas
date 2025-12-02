const { Product, Category } = require('../models');

class ProductService {
  async getAllProducts() {
    try {
      return await Product.findAll({
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }],
        order: [['name', 'ASC']]
      });
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }
  }

  async getProductById(id) {
    const product = await Product.findByPk(id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }]
    });
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async createProduct(productData) {
    // Verify category exists if provided
    if (productData.category_id) {
      const category = await Category.findByPk(productData.category_id);
      if (!category) {
        throw new Error('Category not found');
      }
    }

    try {
      const product = await Product.create(productData);
      return await this.getProductById(product.id);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        throw new Error(error.errors.map(e => e.message).join(', '));
      }
      throw error;
    }
  }

  async updateProduct(id, productData) {
    const product = await this.getProductById(id);

    // If category is being updated, verify it exists
    if (productData.category_id) {
      const category = await Category.findByPk(productData.category_id);
      if (!category) {
        throw new Error('Category not found');
      }
    }

    await product.update(productData);
    return await this.getProductById(id);
  }

  async deleteProduct(id) {
    const product = await this.getProductById(id);
    await product.destroy();
    return { message: 'Product deleted successfully' };
  }

  async getProductsByCategory(categoryId) {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    return await Product.findAll({
      where: { category_id: categoryId },
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }],
      order: [['name', 'ASC']]
    });
  }
}

module.exports = new ProductService();
