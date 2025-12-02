const productService = require('../../services/productService');
const { Product, Category } = require('../../models');

// Mock the models
jest.mock('../../models', () => ({
  Product: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn()
  },
  Category: {
    findByPk: jest.fn()
  }
}));

describe('ProductService - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return all products with categories', async () => {
      const mockProducts = [
        {
          id: 1,
          name: 'Laptop',
          price: 1000,
          stock: 10,
          category: { id: 1, name: 'Electronics' }
        },
        {
          id: 2,
          name: 'Mouse',
          price: 20,
          stock: 50,
          category: { id: 1, name: 'Electronics' }
        }
      ];

      Product.findAll.mockResolvedValue(mockProducts);

      const result = await productService.getAllProducts();

      expect(result).toEqual(mockProducts);
      expect(Product.findAll).toHaveBeenCalledWith({
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }],
        order: [['name', 'ASC']]
      });
    });

    it('should throw error when database query fails', async () => {
      Product.findAll.mockRejectedValue(new Error('Database error'));

      await expect(productService.getAllProducts())
        .rejects
        .toThrow('Error fetching products: Database error');
    });
  });

  describe('getProductById', () => {
    it('should return product when found', async () => {
      const mockProduct = {
        id: 1,
        name: 'Laptop',
        price: 1000,
        stock: 10,
        category: { id: 1, name: 'Electronics' }
      };

      Product.findByPk.mockResolvedValue(mockProduct);

      const result = await productService.getProductById(1);

      expect(result).toEqual(mockProduct);
      expect(Product.findByPk).toHaveBeenCalledWith(1, {
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }]
      });
    });

    it('should throw error when product not found', async () => {
      Product.findByPk.mockResolvedValue(null);

      await expect(productService.getProductById(999))
        .rejects
        .toThrow('Product not found');
    });
  });

  describe('createProduct', () => {
    it('should create and return new product', async () => {
      const productData = {
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        stock: 10,
        category_id: 1
      };

      const mockCategory = { id: 1, name: 'Electronics' };
      const mockCreatedProduct = { id: 1, ...productData };
      const mockProductWithCategory = {
        ...mockCreatedProduct,
        category: mockCategory
      };

      Category.findByPk.mockResolvedValue(mockCategory);
      Product.create.mockResolvedValue(mockCreatedProduct);
      Product.findByPk.mockResolvedValue(mockProductWithCategory);

      const result = await productService.createProduct(productData);

      expect(Category.findByPk).toHaveBeenCalledWith(1);
      expect(Product.create).toHaveBeenCalledWith(productData);
      expect(result).toEqual(mockProductWithCategory);
    });

    it('should throw error when category not found', async () => {
      const productData = {
        name: 'Laptop',
        price: 1000,
        stock: 10,
        category_id: 999
      };

      Category.findByPk.mockResolvedValue(null);

      await expect(productService.createProduct(productData))
        .rejects
        .toThrow('Error creating product: Category not found');
    });

    it('should throw error when product creation fails', async () => {
      const productData = {
        name: 'Laptop',
        price: 1000,
        stock: 10,
        category_id: 1
      };

      Category.findByPk.mockResolvedValue({ id: 1, name: 'Electronics' });
      Product.create.mockRejectedValue(new Error('Database error'));

      await expect(productService.createProduct(productData))
        .rejects
        .toThrow('Error creating product: Database error');
    });
  });

  describe('updateProduct', () => {
    it('should update and return product', async () => {
      const mockProduct = {
        id: 1,
        name: 'Laptop',
        price: 1000,
        stock: 10,
        category_id: 1,
        update: jest.fn().mockResolvedValue(true)
      };

      const mockUpdatedProduct = {
        ...mockProduct,
        price: 900,
        category: { id: 1, name: 'Electronics' }
      };

      Product.findByPk
        .mockResolvedValueOnce(mockProduct)
        .mockResolvedValueOnce(mockUpdatedProduct);

      const updateData = { price: 900 };
      const result = await productService.updateProduct(1, updateData);

      expect(mockProduct.update).toHaveBeenCalledWith(updateData);
      expect(result).toEqual(mockUpdatedProduct);
    });

    it('should validate category when updating', async () => {
      const mockProduct = {
        id: 1,
        name: 'Laptop',
        update: jest.fn().mockResolvedValue(true)
      };

      const mockCategory = { id: 2, name: 'Books' };
      const mockUpdatedProduct = {
        ...mockProduct,
        category_id: 2,
        category: mockCategory
      };

      Product.findByPk
        .mockResolvedValueOnce(mockProduct)
        .mockResolvedValueOnce(mockUpdatedProduct);
      Category.findByPk.mockResolvedValue(mockCategory);

      const updateData = { category_id: 2 };
      const result = await productService.updateProduct(1, updateData);

      expect(Category.findByPk).toHaveBeenCalledWith(2);
      expect(result).toEqual(mockUpdatedProduct);
    });

    it('should throw error when product not found', async () => {
      Product.findByPk.mockResolvedValue(null);

      await expect(productService.updateProduct(999, { price: 900 }))
        .rejects
        .toThrow('Product not found');
    });

    it('should throw error when new category not found', async () => {
      const mockProduct = {
        id: 1,
        name: 'Laptop',
        update: jest.fn()
      };

      Product.findByPk.mockResolvedValue(mockProduct);
      Category.findByPk.mockResolvedValue(null);

      await expect(productService.updateProduct(1, { category_id: 999 }))
        .rejects
        .toThrow('Category not found');
    });
  });

  describe('deleteProduct', () => {
    it('should delete product successfully', async () => {
      const mockProduct = {
        id: 1,
        name: 'Laptop',
        destroy: jest.fn().mockResolvedValue(true)
      };

      Product.findByPk.mockResolvedValue(mockProduct);

      const result = await productService.deleteProduct(1);

      expect(mockProduct.destroy).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Product deleted successfully' });
    });

    it('should throw error when product not found', async () => {
      Product.findByPk.mockResolvedValue(null);

      await expect(productService.deleteProduct(999))
        .rejects
        .toThrow('Product not found');
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products filtered by category', async () => {
      const mockCategory = { id: 1, name: 'Electronics' };
      const mockProducts = [
        {
          id: 1,
          name: 'Laptop',
          category_id: 1,
          category: mockCategory
        },
        {
          id: 2,
          name: 'Mouse',
          category_id: 1,
          category: mockCategory
        }
      ];

      Category.findByPk.mockResolvedValue(mockCategory);
      Product.findAll.mockResolvedValue(mockProducts);

      const result = await productService.getProductsByCategory(1);

      expect(Category.findByPk).toHaveBeenCalledWith(1);
      expect(Product.findAll).toHaveBeenCalledWith({
        where: { category_id: 1 },
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }],
        order: [['name', 'ASC']]
      });
      expect(result).toEqual(mockProducts);
    });

    it('should throw error when category not found', async () => {
      Category.findByPk.mockResolvedValue(null);

      await expect(productService.getProductsByCategory(999))
        .rejects
        .toThrow('Category not found');
    });
  });
});
