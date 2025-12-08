import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  fetchCategories as fetchCategoriesAPI,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from '@/services/categoryService';

/**
 * Hook for fetching and managing categories
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
      // Extract data from response - handle both {data: []} and {success: true, data: []} formats
      const categoriesData = response.data || response;
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Gagal mengambil data kategori');
      toast.error('Terjadi kesalahan saat mengambil data');
      setCategories([]); // Set empty array on error
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
 * Hook for managing category CRUD operations
 */
export function useCategoryMutations(onSuccess) {
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (categoryData) => {
    try {
      setSubmitting(true);
      await createCategory(categoryData);
      toast.success('Kategori berhasil ditambahkan');
      onSuccess?.();
      return true;
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error(error.response?.data?.message || 'Gagal menambahkan kategori');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id, categoryData) => {
    try {
      setSubmitting(true);
      await updateCategory(id, categoryData);
      toast.success('Kategori berhasil diperbarui');
      onSuccess?.();
      return true;
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error(error.response?.data?.message || 'Gagal memperbarui kategori');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setSubmitting(true);
      await deleteCategory(id);
      toast.success('Kategori berhasil dihapus');
      onSuccess?.();
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus kategori');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    createCategory: handleCreate,
    updateCategory: handleUpdate,
    deleteCategory: handleDelete,
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
      toast.error(error.response?.data?.message || 'Gagal menambahkan subkategori');
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
      toast.error(error.response?.data?.message || 'Gagal memperbarui subkategori');
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
      toast.error(error.response?.data?.message || 'Gagal menghapus subkategori');
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
