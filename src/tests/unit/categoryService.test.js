const categoryService = require('../../services/categoryService');
const { Category } = require('../../models');

// Mock the Category model
jest.mock('../../models', () => ({
  Category: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn()
  },
  Product: {}
}));

describe('CategoryService - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCategories', () => {
    it('should return all categories ordered by name', async () => {
      const mockCategories = [
        { id: 1, name: 'Electronics' },
        { id: 2, name: 'Books' }
      ];

      Category.findAll.mockResolvedValue(mockCategories);

      const result = await categoryService.getAllCategories();

      expect(result).toEqual(mockCategories);
      expect(Category.findAll).toHaveBeenCalledWith({
        order: [['name', 'ASC']]
      });
    });

    it('should throw error when database query fails', async () => {
      Category.findAll.mockRejectedValue(new Error('Database error'));

      await expect(categoryService.getAllCategories())
        .rejects
        .toThrow('Error fetching categories: Database error');
    });
  });

  describe('getCategoryById', () => {
    it('should return category when found', async () => {
      const mockCategory = { id: 1, name: 'Electronics' };
      Category.findByPk.mockResolvedValue(mockCategory);

      const result = await categoryService.getCategoryById(1);

      expect(result).toEqual(mockCategory);
      expect(Category.findByPk).toHaveBeenCalledWith(1);
    });

    it('should throw error when category not found', async () => {
      Category.findByPk.mockResolvedValue(null);

      await expect(categoryService.getCategoryById(999))
        .rejects
        .toThrow('Category not found');
    });
  });

  describe('createCategory', () => {
    it('should create and return new category', async () => {
      const categoryData = { name: 'Electronics' };
      const mockCategory = { id: 1, ...categoryData };

      Category.create.mockResolvedValue(mockCategory);

      const result = await categoryService.createCategory(categoryData);

      expect(result).toEqual(mockCategory);
      expect(Category.create).toHaveBeenCalledWith(categoryData);
    });

    it('should throw error when category name already exists', async () => {
      const categoryData = { name: 'Electronics' };
      const error = new Error('Unique constraint error');
      error.name = 'SequelizeUniqueConstraintError';

      Category.create.mockRejectedValue(error);

      await expect(categoryService.createCategory(categoryData))
        .rejects
        .toThrow('Category name already exists');
    });

    it('should throw generic error for other database errors', async () => {
      const categoryData = { name: 'Electronics' };
      Category.create.mockRejectedValue(new Error('Database error'));

      await expect(categoryService.createCategory(categoryData))
        .rejects
        .toThrow('Error creating category: Database error');
    });
  });

  describe('updateCategory', () => {
    it('should update and return category', async () => {
      const mockCategory = {
        id: 1,
        name: 'Electronics',
        update: jest.fn().mockResolvedValue({ id: 1, name: 'Updated Electronics' })
      };

      Category.findByPk.mockResolvedValue(mockCategory);

      const updateData = { name: 'Updated Electronics' };
      const result = await categoryService.updateCategory(1, updateData);

      expect(mockCategory.update).toHaveBeenCalledWith(updateData);
      expect(result).toEqual({ id: 1, name: 'Updated Electronics' });
    });

    it('should throw error when category not found', async () => {
      Category.findByPk.mockResolvedValue(null);

      await expect(categoryService.updateCategory(999, { name: 'Test' }))
        .rejects
        .toThrow('Category not found');
    });

    it('should throw error when name already exists', async () => {
      const mockCategory = {
        id: 1,
        name: 'Electronics',
        update: jest.fn().mockRejectedValue({
          name: 'SequelizeUniqueConstraintError'
        })
      };

      Category.findByPk.mockResolvedValue(mockCategory);

      await expect(categoryService.updateCategory(1, { name: 'Books' }))
        .rejects
        .toThrow('Category name already exists');
    });
  });

  describe('deleteCategory', () => {
    it('should delete category successfully', async () => {
      const mockCategory = {
        id: 1,
        name: 'Electronics',
        destroy: jest.fn().mockResolvedValue(true)
      };

      Category.findByPk.mockResolvedValue(mockCategory);

      const result = await categoryService.deleteCategory(1);

      expect(mockCategory.destroy).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Category deleted successfully' });
    });

    it('should throw error when category not found', async () => {
      Category.findByPk.mockResolvedValue(null);

      await expect(categoryService.deleteCategory(999))
        .rejects
        .toThrow('Category not found');
    });
  });
});
