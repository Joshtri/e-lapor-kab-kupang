'use client';

import { useState, useMemo } from 'react';
import ListGrid, {
  ActionButtonsPresets,
} from '@/components/ui/datatable/ListGrid';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import {
  useCategories,
  useSubcategories,
  useSubcategoryMutations,
} from '../hooks';
import SubcategoryFormModal from '../SubcategoryFormModal';
import { getColumns } from './columns';

export default function KelolaSubkategoriList() {
  const { categories, loading: categoriesLoading } = useCategories();
  const [filterCategoryId, setFilterCategoryId] = useState(null);
  const {
    subcategories,
    loading: subcategoriesLoading,
    refetch,
  } = useSubcategories(filterCategoryId);

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [deletingSubcategory, setDeletingSubcategory] = useState(null);

  const subcategoryMutations = useSubcategoryMutations(refetch);

  // Filter and search
  const filteredSubcategories = useMemo(() => {
    if (!searchQuery.trim()) return subcategories;

    const query = searchQuery.toLowerCase();
    return subcategories.filter((subcategory) => {
      const searchText = [
        subcategory.name,
        subcategory.category?.name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchText.includes(query);
    });
  }, [subcategories, searchQuery]);

  // Handlers
  const handleAdd = () => {
    setEditingSubcategory(null);
    setShowModal(true);
  };

  const handleEdit = (subcategory) => {
    setEditingSubcategory(subcategory);
    setShowModal(true);
  };

  const handleSubmit = async (formData) => {
    if (editingSubcategory) {
      const success = await subcategoryMutations.updateSubcategory(
        editingSubcategory.id,
        formData
      );
      if (success) {
        setShowModal(false);
        setEditingSubcategory(null);
      }
      return success;
    } else {
      const success = await subcategoryMutations.createSubcategory(formData);
      if (success) {
        setShowModal(false);
      }
      return success;
    }
  };

  const handleDelete = (subcategory) => {
    setDeletingSubcategory(subcategory);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingSubcategory) return;

    const success = await subcategoryMutations.deleteSubcategory(
      deletingSubcategory.id
    );

    if (success) {
      setShowDeleteModal(false);
      setDeletingSubcategory(null);
    }
  };

  // Filters config for ListGrid
  const filters = [
    {
      type: 'select',
      label: 'Filter Kategori',
      value: filterCategoryId || 'ALL',
      onChange: (value) => {
        setFilterCategoryId(value === 'ALL' ? null : value);
      },
      options: [
        { value: 'ALL', label: 'Semua Kategori' },
        ...categories.map((cat) => ({
          value: cat.id,
          label: cat.name,
        })),
      ],
    },
  ];

  // Get columns
  const columns = getColumns();

  const loading = categoriesLoading || subcategoriesLoading;

  return (
    <>
      <LoadingScreen isLoading={subcategoryMutations.submitting} />

      <ListGrid
        // Page header props
        title="Kelola Subkategori"
        description="Kelola subkategori pengaduan. Subkategori yang aktif akan muncul di form pengaduan."
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
        createButtonLabel="Tambah Subkategori"
        onCreate={handleAdd}
        // Data & Columns
        data={filteredSubcategories}
        columns={columns}
        pageSize={10}
        showPageSizeSelector={true}
        pageSizeOptions={[10, 25, 50, 75, 100]}
        // Filters
        filters={filters}
        // Standard action buttons
        actionButtons={[
          ActionButtonsPresets.EDIT,
          ActionButtonsPresets.DELETE,
        ]}
        loading={loading}
        onEditClick={handleEdit}
        onDeleteClick={handleDelete}
        emptyMessage="Tidak ada subkategori ditemukan"
        emptyDescription={
          filterCategoryId
            ? 'Tidak ada subkategori untuk kategori yang dipilih'
            : 'Mulai dengan menambahkan subkategori baru'
        }
      />

      {/* Subcategory Form Modal */}
      <SubcategoryFormModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingSubcategory(null);
        }}
        onSubmit={handleSubmit}
        editingSubcategory={editingSubcategory}
        categories={categories}
        submitting={subcategoryMutations.submitting}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteModal}
        title="Hapus Subkategori?"
        message={
          deletingSubcategory ? (
            <>
              Apakah Anda yakin ingin menghapus subkategori{' '}
              <strong>{deletingSubcategory.name}</strong>?
            </>
          ) : (
            ''
          )
        }
        confirmText="Ya, Hapus"
        cancelText="Batal"
        confirmColor="red"
        isLoading={subcategoryMutations.submitting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setDeletingSubcategory(null);
        }}
      />
    </>
  );
}
