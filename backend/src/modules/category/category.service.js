const categoryRepository = require('./category.repository');
const { ConflictError, NotFoundError } = require('../../common/errors/ConcreteErrors');

// Get all fine categories.
exports.getAllCategories = async (onlyActive = false) => {
  return await categoryRepository.findAll(onlyActive);
};

// Get a single category by ID.
exports.getCategoryById = async (id) => {
  const category = await categoryRepository.findById(id);
  if (!category) {
    throw new NotFoundError(`Fine category with ID ${id} not found`);
  }
  return category;
};

// Create a new fine category.
exports.createCategory = async (categoryData) => {
  // Check if code already exists to prevent duplication
  const existing = await categoryRepository.findByCode(categoryData.code);
  if (existing) {
    throw new ConflictError(`Category code '${categoryData.code}' is already registered`);
  }

  return await categoryRepository.insert(categoryData);
};

// Update an existing fine category.
exports.updateCategory = async (id, categoryData) => {
  // Verify category exists first
  const existing = await categoryRepository.findById(id);
  if (!existing) {
    throw new NotFoundError(`Fine category with ID ${id} not found`);
  }

  // If they are attempting to change the status, name, description, or amount:
  // Build the updated object merge
  const updatedData = {
    name: categoryData.name !== undefined ? categoryData.name : existing.name,
    description: categoryData.description !== undefined ? categoryData.description : existing.description,
    base_amount: categoryData.base_amount !== undefined ? categoryData.base_amount : existing.base_amount,
    is_active: categoryData.is_active !== undefined ? categoryData.is_active : existing.is_active,
  };

  return await categoryRepository.update(id, updatedData);
};

// Deactivate (soft delete) a fine category.
exports.deactivateCategory = async (id) => {
  const existing = await categoryRepository.findById(id);
  if (!existing) {
    throw new NotFoundError(`Fine category with ID ${id} not found`);
  }
  return await categoryRepository.deactivate(id);
};
