import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  fetchSubcategories as fetchSubcategoriesAPI,
  fetchCategories as fetchCategoriesAPI,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from '@/services/categoryService';

/**
 * Hook for fetching all categories (for dropdown/filter)
 */
export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchCategoriesAPI(false);
      const categoriesData = response.data || response;
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Gagal mengambil data kategori');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}

/**
 * Hook for fetching subcategories with optional category filter
 */
export function useSubcategories(categoryId = null) {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchSubcategoriesAPI(categoryId, false);
      const subcategoriesData = response.data || response;
      setSubcategories(
        Array.isArray(subcategoriesData) ? subcategoriesData : []
      );
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      setError(err.message || 'Gagal mengambil data subkategori');
      toast.error('Terjadi kesalahan saat mengambil data');
      setSubcategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubcategories();
  }, [categoryId]);

  return {
    subcategories,
    loading,
    error,
    refetch: fetchSubcategories,
  };
}

/**
 * Hook for managing subcategory CRUD operations
 */
export function useSubcategoryMutations(onSuccess) {
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (subcategoryData) => {
    try {
      setSubmitting(true);
      await createSubcategory(subcategoryData);
      toast.success('Subkategori berhasil ditambahkan');
      onSuccess?.();
      return true;
    } catch (error) {
      console.error('Error creating subcategory:', error);
      toast.error(
        error.response?.data?.message || 'Gagal menambahkan subkategori'
      );
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id, subcategoryData) => {
    try {
      setSubmitting(true);
      await updateSubcategory(id, subcategoryData);
      toast.success('Subkategori berhasil diperbarui');
      onSuccess?.();
      return true;
    } catch (error) {
      console.error('Error updating subcategory:', error);
      toast.error(
        error.response?.data?.message || 'Gagal memperbarui subkategori'
      );
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setSubmitting(true);
      await deleteSubcategory(id);
      toast.success('Subkategori berhasil dihapus');
      onSuccess?.();
      return true;
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      toast.error(
        error.response?.data?.message || 'Gagal menghapus subkategori'
      );
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    createSubcategory: handleCreate,
    updateSubcategory: handleUpdate,
    deleteSubcategory: handleDelete,
  };
}
