import axios from 'axios';

const API_BASE_CATEGORIES = '/api/categories';
const API_BASE_SUBCATEGORIES = '/api/subcategories';

/**
 * Fetch all categories with subcategories
 * @param {boolean} activeOnly - If true, only fetch active categories
 */
export const fetchCategories = async (activeOnly = false) => {
  const params = activeOnly ? { activeOnly: 'true' } : {};
  const { data } = await axios.get(API_BASE_CATEGORIES, { params });
  return data;
};

/**
 * Fetch single category by ID
 * @param {string} id - Category ID
 */
export const fetchCategoryById = async (id) => {
  const { data } = await axios.get(`${API_BASE_CATEGORIES}/${id}`);
  return data;
};

/**
 * Create new category
 * @param {Object} categoryData - Category data { name, isActive }
 */
export const createCategory = async (categoryData) => {
  const { data } = await axios.post(API_BASE_CATEGORIES, categoryData);
  return data;
};

/**
 * Update category by ID
 * @param {string} id - Category ID
 * @param {Object} categoryData - Category data { name, isActive }
 */
export const updateCategory = async (id, categoryData) => {
  const { data } = await axios.put(`${API_BASE_CATEGORIES}/${id}`, categoryData);
  return data;
};

/**
 * Delete category by ID
 * @param {string} id - Category ID
 */
export const deleteCategory = async (id) => {
  const { data } = await axios.delete(`${API_BASE_CATEGORIES}/${id}`);
  return data;
};

/**
 * Fetch all subcategories
 * @param {string} categoryId - Optional category ID to filter by
 * @param {boolean} activeOnly - If true, only fetch active subcategories
 */
export const fetchSubcategories = async (categoryId = null, activeOnly = false) => {
  const params = {};
  if (categoryId) params.categoryId = categoryId;
  if (activeOnly) params.activeOnly = 'true';

  const { data } = await axios.get(API_BASE_SUBCATEGORIES, { params });
  return data;
};

/**
 * Fetch single subcategory by ID
 * @param {string} id - Subcategory ID
 */
export const fetchSubcategoryById = async (id) => {
  const { data } = await axios.get(`${API_BASE_SUBCATEGORIES}/${id}`);
  return data;
};

/**
 * Create new subcategory
 * @param {Object} subcategoryData - Subcategory data { categoryId, name, isActive }
 */
export const createSubcategory = async (subcategoryData) => {
  const { data } = await axios.post(API_BASE_SUBCATEGORIES, subcategoryData);
  return data;
};

/**
 * Update subcategory by ID
 * @param {string} id - Subcategory ID
 * @param {Object} subcategoryData - Subcategory data { categoryId, name, isActive }
 */
export const updateSubcategory = async (id, subcategoryData) => {
  const { data } = await axios.put(`${API_BASE_SUBCATEGORIES}/${id}`, subcategoryData);
  return data;
};

/**
 * Delete subcategory by ID
 * @param {string} id - Subcategory ID
 */
export const deleteSubcategory = async (id) => {
  const { data } = await axios.delete(`${API_BASE_SUBCATEGORIES}/${id}`);
  return data;
};
