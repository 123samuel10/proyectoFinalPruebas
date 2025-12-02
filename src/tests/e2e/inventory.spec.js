const { test, expect } = require('@playwright/test');

test.describe('Inventory Management System - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('Complete flow: Create category, create product, and view product in list', async ({ page }) => {
    // Step 1: Create a new category
    await test.step('Create new category', async () => {
      // Click on Categories tab
      await page.click('text=Categorías');

      // Wait for the categories tab to be visible
      await page.waitForSelector('#categories-tab', { state: 'visible' });

      // Fill in category name
      await page.fill('input[name="name"]', 'Electronics Test');

      // Submit the form
      await page.click('#categories-tab button[type="submit"]');

      // Wait for success toast
      await page.waitForSelector('.toast.success', { timeout: 5000 });

      // Verify the toast message
      const toastText = await page.textContent('.toast.success');
      expect(toastText).toContain('exitosamente');

      // Wait for toast to disappear
      await page.waitForTimeout(1000);

      // Verify category appears in the list
      await page.waitForSelector('text=Electronics Test', { timeout: 5000 });
      const categoryExists = await page.isVisible('text=Electronics Test');
      expect(categoryExists).toBeTruthy();
    });

    // Step 2: Create a new product
    await test.step('Create new product', async () => {
      // Switch to Products tab by calling the function directly
      await page.evaluate(() => window.showTab('products'));

      // Wait for the products tab to be visible
      await page.waitForSelector('#products-tab', { state: 'visible' });

      // Fill in product details
      await page.fill('#products-tab input[name="name"]', 'Gaming Laptop');
      await page.fill('#products-tab textarea[name="description"]', 'High-performance gaming laptop');
      await page.fill('#products-tab input[name="price"]', '1200');
      await page.fill('#products-tab input[name="stock"]', '15');

      // Select the category we just created
      await page.selectOption('#products-tab select[name="category_id"]', { label: 'Electronics Test' });

      // Submit the form
      await page.click('#products-tab button[type="submit"]');

      // Wait for success toast
      await page.waitForSelector('.toast.success', { timeout: 5000 });

      // Verify the toast message
      const toastText = await page.textContent('.toast.success');
      expect(toastText).toContain('exitosamente');
    });

    // Step 3: View product in the list
    await test.step('View product in list', async () => {
      // Click on List tab
      await page.click('text=Listar');

      // Wait for products to load
      await page.waitForSelector('#list-tab', { state: 'visible' });
      await page.waitForTimeout(1000);

      // Verify product appears in the list
      await page.waitForSelector('text=Gaming Laptop', { timeout: 5000 });
      const productExists = await page.isVisible('text=Gaming Laptop');
      expect(productExists).toBeTruthy();

      // Verify product details
      const descriptionExists = await page.isVisible('text=High-performance gaming laptop');
      expect(descriptionExists).toBeTruthy();

      const priceExists = await page.isVisible('text=$1200.00');
      expect(priceExists).toBeTruthy();

      const stockExists = await page.isVisible('text=15 unidades');
      expect(stockExists).toBeTruthy();

      const categoryExists = await page.isVisible('text=Electronics Test');
      expect(categoryExists).toBeTruthy();
    });
  });

  test('Edit and update a product', async ({ page }) => {
    // First create a category and product
    await test.step('Setup: Create category and product', async () => {
      // Create category
      await page.click('text=Categorías');
      await page.fill('input[name="name"]', 'Books Test');
      await page.click('#categories-tab button[type="submit"]');
      await page.waitForSelector('.toast.success');
      await page.waitForTimeout(1000);

      // Create product
      await page.evaluate(() => window.showTab('products'));
      await page.waitForSelector('#products-tab', { state: 'visible' });
      await page.fill('#products-tab input[name="name"]', 'JavaScript Book');
      await page.fill('#products-tab textarea[name="description"]', 'Learn JavaScript');
      await page.fill('#products-tab input[name="price"]', '30');
      await page.fill('#products-tab input[name="stock"]', '20');
      await page.selectOption('#products-tab select[name="category_id"]', { label: 'Books Test' });
      await page.click('#products-tab button[type="submit"]');
      await page.waitForSelector('.toast.success');
      await page.waitForTimeout(1000);
    });

    // Edit the product
    await test.step('Edit product', async () => {
      // Go to list
      await page.click('text=Listar');
      await page.waitForSelector('text=JavaScript Book');

      // Click edit button
      await page.click('text=JavaScript Book >> .. >> .. >> button:has-text("Editar")');

      // Wait for modal
      await page.waitForSelector('#edit-modal.active');

      // Update product details
      await page.fill('#edit-product-name', 'Advanced JavaScript Book');
      await page.fill('#edit-product-price', '35');
      await page.fill('#edit-product-stock', '25');

      // Submit the form
      await page.click('#edit-modal button[type="submit"]');

      // Wait for success toast
      await page.waitForSelector('.toast.success');

      // Verify updates
      await page.waitForTimeout(1000);
      await page.waitForSelector('text=Advanced JavaScript Book');
      const updatedName = await page.isVisible('text=Advanced JavaScript Book');
      expect(updatedName).toBeTruthy();

      const updatedPrice = await page.isVisible('text=$35.00');
      expect(updatedPrice).toBeTruthy();

      const updatedStock = await page.isVisible('text=25 unidades');
      expect(updatedStock).toBeTruthy();
    });
  });

  test('Delete a product', async ({ page }) => {
    // First create a category and product
    await test.step('Setup: Create category and product', async () => {
      // Create category
      await page.click('text=Categorías');
      await page.fill('input[name="name"]', 'Toys Test');
      await page.click('#categories-tab button[type="submit"]');
      await page.waitForSelector('.toast.success');
      await page.waitForTimeout(1000);

      // Create product
      await page.evaluate(() => window.showTab('products'));
      await page.waitForSelector('#products-tab', { state: 'visible' });
      await page.fill('#products-tab input[name="name"]', 'Action Figure');
      await page.fill('#products-tab input[name="price"]', '25');
      await page.fill('#products-tab input[name="stock"]', '10');
      await page.selectOption('#products-tab select[name="category_id"]', { label: 'Toys Test' });
      await page.click('#products-tab button[type="submit"]');
      await page.waitForSelector('.toast.success');
      await page.waitForTimeout(1000);
    });

    // Delete the product
    await test.step('Delete product', async () => {
      // Go to list
      await page.click('text=Listar');
      await page.waitForSelector('text=Action Figure');

      // Setup dialog handler to accept confirmation
      page.on('dialog', dialog => dialog.accept());

      // Click delete button
      await page.click('text=Action Figure >> .. >> .. >> button:has-text("Eliminar")');

      // Wait for success toast
      await page.waitForSelector('.toast.success');

      // Verify product is deleted
      await page.waitForTimeout(1000);
      const productExists = await page.isVisible('text=Action Figure');
      expect(productExists).toBeFalsy();
    });
  });

  test('Filter products by category', async ({ page }) => {
    // Create two categories with products
    await test.step('Setup: Create categories and products', async () => {
      // Create first category
      await page.click('text=Categorías');
      await page.fill('input[name="name"]', 'Category A');
      await page.click('#categories-tab button[type="submit"]');
      await page.waitForSelector('.toast.success');
      await page.waitForTimeout(1000);

      // Create second category
      await page.fill('input[name="name"]', 'Category B');
      await page.click('#categories-tab button[type="submit"]');
      await page.waitForSelector('.toast.success');
      await page.waitForTimeout(1000);

      // Create product in Category A
      await page.evaluate(() => window.showTab('products'));
      await page.waitForSelector('#products-tab', { state: 'visible' });
      await page.fill('#products-tab input[name="name"]', 'Product A');
      await page.fill('#products-tab input[name="price"]', '10');
      await page.fill('#products-tab input[name="stock"]', '5');
      await page.selectOption('#products-tab select[name="category_id"]', { label: 'Category A' });
      await page.click('#products-tab button[type="submit"]');
      await page.waitForSelector('.toast.success');
      await page.waitForTimeout(1000);

      // Create product in Category B
      await page.fill('#products-tab input[name="name"]', 'Product B');
      await page.fill('#products-tab input[name="price"]', '20');
      await page.fill('#products-tab input[name="stock"]', '8');
      await page.selectOption('#products-tab select[name="category_id"]', { label: 'Category B' });
      await page.click('#products-tab button[type="submit"]');
      await page.waitForSelector('.toast.success');
      await page.waitForTimeout(1000);
    });

    // Test filtering
    await test.step('Filter products', async () => {
      // Go to list
      await page.click('text=Listar');
      await page.waitForTimeout(1000);

      // Both products should be visible
      let productA = await page.isVisible('text=Product A');
      let productB = await page.isVisible('text=Product B');
      expect(productA).toBeTruthy();
      expect(productB).toBeTruthy();

      // Filter by Category A
      await page.selectOption('#filter-category', { label: 'Category A' });
      await page.waitForTimeout(500);

      // Only Product A should be visible
      productA = await page.isVisible('text=Product A');
      productB = await page.isVisible('text=Product B');
      expect(productA).toBeTruthy();
      expect(productB).toBeFalsy();

      // Filter by Category B
      await page.selectOption('#filter-category', { label: 'Category B' });
      await page.waitForTimeout(500);

      // Only Product B should be visible
      productA = await page.isVisible('text=Product A');
      productB = await page.isVisible('text=Product B');
      expect(productA).toBeFalsy();
      expect(productB).toBeTruthy();
    });
  });

  test('API health check endpoint', async ({ page }) => {
    const response = await page.request.get('/api/health');
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.message).toBeDefined();
  });
});
