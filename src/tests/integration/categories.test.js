const request = require('supertest');
const app = require('../../index');
const { sequelize, syncDatabase } = require('../../models');

describe('Categories API - Integration Tests', () => {
  beforeAll(async () => {
    // Use test database or in-memory database
    await syncDatabase(true); // Force sync (drops tables)
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    // Clean database before each test
    await syncDatabase(true);
  });

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const categoryData = { name: 'Electronics' };

      const response = await request(app)
        .post('/api/categories')
        .send(categoryData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe('Electronics');
    });

    it('should return 400 when name is missing', async () => {
      const response = await request(app)
        .post('/api/categories')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 when creating duplicate category', async () => {
      const categoryData = { name: 'Electronics' };

      // Create first category
      await request(app)
        .post('/api/categories')
        .send(categoryData)
        .expect(201);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/categories')
        .send(categoryData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('already exists');
    });
  });

  describe('GET /api/categories', () => {
    it('should return empty array when no categories exist', async () => {
      const response = await request(app)
        .get('/api/categories')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('should return all categories', async () => {
      // Create test categories
      await request(app).post('/api/categories').send({ name: 'Electronics' });
      await request(app).post('/api/categories').send({ name: 'Books' });
      await request(app).post('/api/categories').send({ name: 'Clothing' });

      const response = await request(app)
        .get('/api/categories')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.data[0].name).toBe('Books'); // Should be ordered alphabetically
      expect(response.body.data[1].name).toBe('Clothing');
      expect(response.body.data[2].name).toBe('Electronics');
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should return category by id', async () => {
      // Create a category
      const createResponse = await request(app)
        .post('/api/categories')
        .send({ name: 'Electronics' });

      const categoryId = createResponse.body.data.id;

      const response = await request(app)
        .get(`/api/categories/${categoryId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(categoryId);
      expect(response.body.data.name).toBe('Electronics');
    });

    it('should return 404 when category not found', async () => {
      const response = await request(app)
        .get('/api/categories/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update category', async () => {
      // Create a category
      const createResponse = await request(app)
        .post('/api/categories')
        .send({ name: 'Electronics' });

      const categoryId = createResponse.body.data.id;

      // Update the category
      const response = await request(app)
        .put(`/api/categories/${categoryId}`)
        .send({ name: 'Updated Electronics' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Electronics');
    });

    it('should return 404 when updating non-existent category', async () => {
      const response = await request(app)
        .put('/api/categories/999')
        .send({ name: 'Updated' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 when updating to duplicate name', async () => {
      // Create two categories
      await request(app).post('/api/categories').send({ name: 'Electronics' });
      const response2 = await request(app).post('/api/categories').send({ name: 'Books' });

      const booksId = response2.body.data.id;

      // Try to update Books to Electronics (duplicate)
      const response = await request(app)
        .put(`/api/categories/${booksId}`)
        .send({ name: 'Electronics' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('already exists');
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete category', async () => {
      // Create a category
      const createResponse = await request(app)
        .post('/api/categories')
        .send({ name: 'Electronics' });

      const categoryId = createResponse.body.data.id;

      // Delete the category
      const response = await request(app)
        .delete(`/api/categories/${categoryId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted');

      // Verify it's deleted
      await request(app)
        .get(`/api/categories/${categoryId}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent category', async () => {
      const response = await request(app)
        .delete('/api/categories/999')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});
