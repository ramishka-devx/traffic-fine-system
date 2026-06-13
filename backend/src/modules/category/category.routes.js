const express = require('express');
const router = express.Router();
const categoryController = require('./category.controller');
const {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator
} = require('./category.validator');

const validate = require('../../middleware/validate');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const ROLES = require('../../common/constants/roles');

router.get(
  '/',
  authenticate,
  categoryController.getAllCategories
);

router.get(
  '/:id',
  authenticate,
  categoryIdValidator,
  validate,
  categoryController.getCategoryById
);

// Create a new fine category. Admin-only access.
router.post(
  '/',
  authenticate,
  authorize(ROLES.ADMIN),
  createCategoryValidator,
  validate,
  categoryController.createCategory
);

// Update details of an existing category. Admin-only access.
router.patch(
  '/:id',
  authenticate,
  authorize(ROLES.ADMIN),
  updateCategoryValidator,
  validate,
  categoryController.updateCategory
);

// Deactivate a category (soft-delete). Admin-only access.
router.delete(
  '/:id',
  authenticate,
  authorize(ROLES.ADMIN),
  categoryIdValidator,
  validate,
  categoryController.deactivateCategory
);

module.exports = router;
