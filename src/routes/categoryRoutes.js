const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', categoryController.getAll);


/**
 * @route   GET /api/categories/:id
 * @desc    Get category by ID
 * @access  Public
 */
router.get('/:id', categoryController.getById);

/**
 * @route   POST /api/categories
 * @desc    Create new category
 * @access  Public
 */
router.post('/', categoryController.create);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category
 * @access  Public
 */
router.put('/:id', categoryController.update);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category
 * @access  Public
 */
router.delete('/:id', categoryController.delete);

module.exports = router;
