'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ListGrid, { ActionButtonsPresets } from '@/components/ui/datatable/ListGrid';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import {
  useCategories,
  useCategoryMutations,
  useSubcategoryMutations,
} from '../hooks';
import { CategoryModal, SubcategoryModal } from '../';
import { getColumns } from './columns';
import { HiPlus } from 'react-icons/hi';

export default function KelolaKategoriList() {
  const router = useRouter();
  const { categories, loading, refetch } = useCategories();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table');

  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const categoryMutations = useCategoryMutations(refetch);
  const subcategoryMutations = useSubcategoryMutations(refetch);

  // Filter and search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const query = searchQuery.toLowerCase();
    return categories.filter((category) => {
      const subcategoryNames =
        category.subcategories?.map((s) => s.name).join(' ') || '';
      const searchText = [category.name, subcategoryNames]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchText.includes(query);
    });
  }, [categories, searchQuery]);

  // Category handlers
  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleSubmitCategory = async (formData) => {
    if (editingCategory) {
      const success = await categoryMutations.updateCategory(
        editingCategory.id,
        formData
      );
      if (success) {
        setShowCategoryModal(false);
        setEditingCategory(null);
      }
      return success;
    } else {
      const success = await categoryMutations.createCategory(formData);
      if (success) {
        setShowCategoryModal(false);
      }
      return success;
    }
  };

  // Subcategory handlers
  const handleAddSubcategory = (category) => {
    setEditingSubcategory(null);
    setSelectedCategoryId(category.id);
    setShowSubcategoryModal(true);
  };

  const handleEditSubcategory = (subcategory, category) => {
    setEditingSubcategory(subcategory);
    setSelectedCategoryId(category.id);
    setShowSubcategoryModal(true);
  };

  const handleDeleteSubcategory = (subcategory) => {
    setDeletingItem({ ...subcategory, type: 'subcategory' });
    setShowDeleteModal(true);
  };

  const handleSubmitSubcategory = async (formData) => {
    if (editingSubcategory) {
      const success = await subcategoryMutations.updateSubcategory(
        editingSubcategory.id,
        formData
      );
      if (success) {
        setShowSubcategoryModal(false);
        setEditingSubcategory(null);
        setSelectedCategoryId(null);
      }
      return success;
    } else {
      const success = await subcategoryMutations.createSubcategory(formData);
      if (success) {
        setShowSubcategoryModal(false);
        setSelectedCategoryId(null);
      }
      return success;
    }
  };

  // Delete handlers
  const handleDeleteCategory = (category) => {
    setDeletingItem({ ...category, type: 'category' });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;

    let success;
    if (deletingItem.type === 'category') {
      success = await categoryMutations.deleteCategory(deletingItem.id);
    } else {
      success = await subcategoryMutations.deleteSubcategory(deletingItem.id);
    }

    if (success) {
      setShowDeleteModal(false);
      setDeletingItem(null);
    }
  };

  // Get columns with handlers
  const columns = getColumns({
    onEditSubcategory: handleEditSubcategory,
    onDeleteSubcategory: handleDeleteSubcategory,
  });

  return (
    <>
      <LoadingScreen
        isLoading={
          categoryMutations.submitting || subcategoryMutations.submitting
        }
      />

      <ListGrid
        // Page header props
        title="Kelola Kategori & Subkategori"
        description="Kelola kategori dan subkategori pengaduan. Kategori yang aktif akan muncul di form pengaduan."
        role="adm"
        showBackButton={false}
        searchBar={true}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showRefreshButton={true}
        onRefreshClick={refetch}
        viewMode={viewMode}
        setViewMode={setViewMode}
        showCreateButton={true}
        createButtonLabel="Tambah Kategori"
        onCreate={handleAddCategory}
        // Data & Columns
        data={filteredCategories}
        columns={columns}
        pageSize={10}
        showPageSizeSelector={true}
        pageSizeOptions={[10, 25, 50, 75, 100]}
        // Standard action buttons
        actionButtons={[
          ActionButtonsPresets.EDIT,
          ActionButtonsPresets.DELETE,
        ]}
        // Custom action buttons
        customActions={[
          {
            icon: HiPlus,
            label: 'Tambah Sub',
            tooltip: 'Tambah Subkategori',
            color: 'success',
            onClick: handleAddSubcategory,
          },
        ]}
        loading={loading}
        onEditClick={handleEditCategory}
        onDeleteClick={handleDeleteCategory}
        emptyMessage="Tidak ada kategori ditemukan"
        emptyDescription="Mulai dengan menambahkan kategori baru"
      />

      {/* Category Modal */}
      <CategoryModal
        show={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false);
          setEditingCategory(null);
        }}
        onSubmit={handleSubmitCategory}
        editingCategory={editingCategory}
        submitting={categoryMutations.submitting}
      />

      {/* Subcategory Modal */}
      <SubcategoryModal
        show={showSubcategoryModal}
        onClose={() => {
          setShowSubcategoryModal(false);
          setEditingSubcategory(null);
          setSelectedCategoryId(null);
        }}
        onSubmit={handleSubmitSubcategory}
        editingSubcategory={editingSubcategory}
        categoryId={selectedCategoryId}
        submitting={subcategoryMutations.submitting}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteModal}
        title="Hapus Kategori?"
        message={
          deletingItem ? (
            <>
              Apakah Anda yakin ingin menghapus kategori{' '}
              <strong>{deletingItem.name}</strong>?
              {deletingItem.type === 'category' && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                  Semua subkategori di bawah kategori ini juga akan dihapus!
                </div>
              )}
            </>
          ) : (
            ''
          )
        }
        confirmText="Ya, Hapus"
        cancelText="Batal"
        confirmColor="red"
        isLoading={
          categoryMutations.submitting || subcategoryMutations.submitting
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setDeletingItem(null);
        }}
      />
    </>
  );
}
