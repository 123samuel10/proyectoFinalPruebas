const request = require('supertest');
const app = require('../../index');
const { sequelize, syncDatabase } = require('../../models');

describe('Products API - Integration Tests', () => {
  let testCategoryId;

  beforeAll(async () => {
    await syncDatabase(true);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    // Clean and setup database
    await syncDatabase(true);

    // Create a test category for products
    const categoryResponse = await request(app)
      .post('/api/categories')
      .send({ name: 'Electronics' });

    testCategoryId = categoryResponse.body.data.id;
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        stock: 10,
        category_id: testCategoryId
      };

      const response = await request(app)
        .post('/api/products')
        .send(productData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe('Laptop');
      expect(response.body.data.price).toBe('1000.00');
      expect(response.body.data.stock).toBe(10);
      expect(response.body.data.category).toBeDefined();
      expect(response.body.data.category.name).toBe('Electronics');
    });

    it('should return 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({ name: 'Laptop' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 when category does not exist', async () => {
      const productData = {
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        stock: 10,
        category_id: 999
      };

      const response = await request(app)
        .post('/api/products')
        .send(productData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Category not found');
    });

    it('should return 400 for invalid price', async () => {
      const productData = {
        name: 'Laptop',
        description: 'Gaming laptop',
        price: -100,
        stock: 10,
        category_id: testCategoryId
      };

      const response = await request(app)
        .post('/api/products')
        .send(productData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid stock', async () => {
      const productData = {
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        stock: -5,
        category_id: testCategoryId
      };

      const response = await request(app)
        .post('/api/products')
        .send(productData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/products', () => {
    it('should return empty array when no products exist', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('should return all products with categories', async () => {
      // Create test products
      await request(app).post('/api/products').send({
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        stock: 10,
        category_id: testCategoryId
      });

      await request(app).post('/api/products').send({
        name: 'Mouse',
        description: 'Wireless mouse',
        price: 20,
        stock: 50,
        category_id: testCategoryId
      });

      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].name).toBe('Laptop'); // Ordered alphabetically
      expect(response.body.data[1].name).toBe('Mouse');
      expect(response.body.data[0].category).toBeDefined();
      expect(response.body.data[0].category.name).toBe('Electronics');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return product by id with category', async () => {
      const createResponse = await request(app)
        .post('/api/products')
        .send({
          name: 'Laptop',
          description: 'Gaming laptop',
          price: 1000,
          stock: 10,
          category_id: testCategoryId
        });

      const productId = createResponse.body.data.id;

      const response = await request(app)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(productId);
      expect(response.body.data.name).toBe('Laptop');
      expect(response.body.data.category).toBeDefined();
    });

    it('should return 404 when product not found', async () => {
      const response = await request(app)
        .get('/api/products/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update product', async () => {
      const createResponse = await request(app)
        .post('/api/products')
        .send({
          name: 'Laptop',
          description: 'Gaming laptop',
          price: 1000,
          stock: 10,
          category_id: testCategoryId
        });

      const productId = createResponse.body.data.id;

      const response = await request(app)
        .put(`/api/products/${productId}`)
        .send({
          name: 'Updated Laptop',
          price: 900,
          stock: 15
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Laptop');
      expect(response.body.data.price).toBe('900.00');
      expect(response.body.data.stock).toBe(15);
    });

    it('should update product category', async () => {
      // Create another category
      const category2Response = await request(app)
        .post('/api/categories')
        .send({ name: 'Books' });

      const category2Id = category2Response.body.data.id;

      const createResponse = await request(app)
        .post('/api/products')
        .send({
          name: 'Laptop',
          description: 'Gaming laptop',
          price: 1000,
          stock: 10,
          category_id: testCategoryId
        });

      const productId = createResponse.body.data.id;

      const response = await request(app)
        .put(`/api/products/${productId}`)
        .send({ category_id: category2Id })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.category.name).toBe('Books');
    });

    it('should return 404 when updating non-existent product', async () => {
      const response = await request(app)
        .put('/api/products/999')
        .send({ name: 'Updated' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 when updating with invalid category', async () => {
      const createResponse = await request(app)
        .post('/api/products')
        .send({
          name: 'Laptop',
          price: 1000,
          stock: 10,
          category_id: testCategoryId
        });

      const productId = createResponse.body.data.id;

      const response = await request(app)
        .put(`/api/products/${productId}`)
        .send({ category_id: 999 })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Category not found');
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete product', async () => {
      const createResponse = await request(app)
        .post('/api/products')
        .send({
          name: 'Laptop',
          price: 1000,
          stock: 10,
          category_id: testCategoryId
        });

      const productId = createResponse.body.data.id;

      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted');

      // Verify it's deleted
      await request(app)
        .get(`/api/products/${productId}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent product', async () => {
      const response = await request(app)
        .delete('/api/products/999')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/products/category/:categoryId', () => {
    it('should return products by category', async () => {
      // Create another category
      const category2Response = await request(app)
        .post('/api/categories')
        .send({ name: 'Books' });

      const category2Id = category2Response.body.data.id;

      // Create products in different categories
      await request(app).post('/api/products').send({
        name: 'Laptop',
        price: 1000,
        stock: 10,
        category_id: testCategoryId
      });

      await request(app).post('/api/products').send({
        name: 'Mouse',
        price: 20,
        stock: 50,
        category_id: testCategoryId
      });

      await request(app).post('/api/products').send({
        name: 'Book 1',
        price: 15,
        stock: 30,
        category_id: category2Id
      });

      const response = await request(app)
        .get(`/api/products/category/${testCategoryId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].category.name).toBe('Electronics');
      expect(response.body.data[1].category.name).toBe('Electronics');
    });

    it('should return 404 when category not found', async () => {
      const response = await request(app)
        .get('/api/products/category/999')
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should return empty array when category has no products', async () => {
      const category2Response = await request(app)
        .post('/api/categories')
        .send({ name: 'Books' });

      const category2Id = category2Response.body.data.id;

      const response = await request(app)
        .get(`/api/products/category/${category2Id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });
  });
});
