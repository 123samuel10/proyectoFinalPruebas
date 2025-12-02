const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Public
 */
router.get('/', productController.getAll);

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/:id', productController.getById);

/**
 * @route   POST /api/products
 * @desc    Create new product
 * @access  Public
 */
router.post('/', productController.create);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Public
 */
router.put('/:id', productController.update);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Public
 */
router.delete('/:id', productController.delete);

/**
 * @route   GET /api/products/category/:categoryId
 * @desc    Get products by category
 * @access  Public
 */
router.get('/category/:categoryId', productController.getByCategory);

module.exports = router;
