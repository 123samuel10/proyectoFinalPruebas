const { Category } = require('../models');

class CategoryService {
  async getAllCategories() {
    try {
      return await Category.findAll({
        order: [['name', 'ASC']]
      });
    } catch (error) {
      throw new Error(`Error fetching categories: ${error.message}`);
    }
  }

  async getCategoryById(id) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async createCategory(categoryData) {
    try {
      return await Category.create(categoryData);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('Category name already exists');
      }
      throw new Error(`Error creating category: ${error.message}`);
    }
  }

  async updateCategory(id, categoryData) {
    try {
      const category = await this.getCategoryById(id);
      return await category.update(categoryData);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('Category name already exists');
      }
      throw error;
    }
  }

  async deleteCategory(id) {
    const category = await this.getCategoryById(id);
    await category.destroy();
    return { message: 'Category deleted successfully' };
  }
}

module.exports = new CategoryService();
