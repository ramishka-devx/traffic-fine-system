const categoryService = require('./category.service');
const asyncHandler = require('../../common/utils/asyncHandler');

// Get all fine categories.
exports.getAllCategories = asyncHandler(async (req, res) => {
  const onlyActive = req.query.active === 'true';
  const categories = await categoryService.getAllCategories(onlyActive);
  
  res.status(200).json({
    success: true,
    data: categories
  });
});

// Get a single fine category by ID.
exports.getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await categoryService.getCategoryById(Number(id));
  
  res.status(200).json({
    success: true,
    data: category
  });
});

// Create a new fine category.
exports.createCategory = asyncHandler(async (req, res) => {
  const { code, name, description, base_amount } = req.body;
  const newCategory = await categoryService.createCategory({
    code,
    name,
    description,
    base_amount
  });
  
  res.status(201).json({
    success: true,
    message: 'Fine category created successfully',
    data: newCategory
  });
});

// Update an existing fine category.
exports.updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, base_amount, is_active } = req.body;
  
  const updatedCategory = await categoryService.updateCategory(Number(id), {
    name,
    description,
    base_amount,
    is_active
  });
  
  res.status(200).json({
    success: true,
    message: 'Fine category updated successfully',
    data: updatedCategory
  });
});

// Deactivate a fine category (soft delete).
exports.deactivateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await categoryService.deactivateCategory(Number(id));
  
  res.status(200).json({
    success: true,
    message: 'Fine category deactivated successfully'
  });
});
