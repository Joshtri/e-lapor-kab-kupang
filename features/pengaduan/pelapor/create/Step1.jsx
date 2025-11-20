'use client';

import { useState } from 'react';
import { Label, Select, Spinner } from 'flowbite-react';
import ReactSelect from 'react-select';
import {
  HiTag,
  HiFlag,
  HiOfficeBuilding,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';
import { motion } from 'framer-motion';
import {
  getMainCategories,
  getSubcategoriesByText,
} from '@/utils/reportCategories';
import { getPriorityColor } from '@/utils/common';
import { useOpdList } from './hooks';
import TextInput from '@/components/ui/inputs/TextInput';

const Step1 = ({ formData, onFormChange, errors }) => {
  const [selectedCategory, setSelectedCategory] = useState(formData.category);
  const [subcategory, setSubcategory] = useState('');
  const { data: opds = [], isLoading: loadingOpds } = useOpdList();

  const handleCategoryChange = (selected) => {
    const value = selected?.value || '';
    onFormChange('category', value);
    setSelectedCategory(value);
    setSubcategory('');
  };

  const handleSubcategoryChange = (selected) => {
    setSubcategory(selected?.value || '');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormChange(name, value);
  };

  const handlePriorityChange = (e) => {
    onFormChange('priority', e.target.value);
  };

  const handleOpdChange = (selected) => {
    onFormChange('opdId', selected?.value || '');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-6">
        {/* Judul Pengaduan */}
        <div className="space-y-2">
          <Label
            htmlFor="title"
            className="flex items-center text-gray-700 dark:text-gray-300"
          >
            <HiTag className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
            Judul Pengaduan <span className="text-red-500 ml-1">*</span>
          </Label>
          <TextInput
            id="title"
            name="title"
            placeholder="Masukkan judul pengaduan..."
            value={formData.title}
            onChange={handleInputChange}
            error={errors.title}
          />
          {!errors.title && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Berikan judul yang singkat dan jelas tentang pengaduan Anda
            </p>
          )}
        </div>

        {/* Kategori */}
        <div className="space-y-2">
          <Label
            htmlFor="category"
            className="flex items-center text-gray-700 dark:text-gray-300"
          >
            <HiTag className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
            Kategori Pengaduan <span className="text-red-500 ml-1">*</span>
          </Label>

          <ReactSelect
            inputId="category"
            options={getMainCategories()}
            value={getMainCategories().find(
              (cat) => cat.value === formData.category,
            )}
            onChange={handleCategoryChange}
            placeholder="Pilih Kategori"
            isClearable
            className="text-sm"
            menuPortalTarget={document.body}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
          />

          {errors.category && (
            <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400">
              <HiOutlineExclamationCircle className="mr-1 h-4 w-4" />
              {errors.category}
            </div>
          )}
        </div>

        {/* Subkategori */}
        {selectedCategory && (
          <div className="space-y-2">
            <Label
              htmlFor="subcategory"
              className="text-gray-700 dark:text-gray-300"
            >
              Subkategori <span className="text-red-500 ml-1">*</span>
            </Label>

            <ReactSelect
              inputId="subcategory"
              options={getSubcategoriesByText(selectedCategory)}
              value={getSubcategoriesByText(selectedCategory).find(
                (sub) => sub.value === subcategory,
              )}
              onChange={handleSubcategoryChange}
              placeholder="Pilih Subkategori"
              isClearable
              className="text-sm"
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />

            {errors.subcategory && (
              <div className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.subcategory}
              </div>
            )}
          </div>
        )}

        {/* Prioritas */}
        <div className="space-y-2">
          <Label
            htmlFor="priority"
            className="flex items-center text-gray-700 dark:text-gray-300"
          >
            <HiFlag className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
            Prioritas <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handlePriorityChange}
            required
            className={`border-gray-300 dark:border-gray-600 ${
              errors.priority ? 'border-red-500 dark:border-red-500' : ''
            }`}
          >
            <option value="LOW">Rendah</option>
            <option value="MEDIUM">Sedang</option>
            <option value="HIGH">Tinggi</option>
          </Select>
          {errors.priority ? (
            <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400">
              <HiOutlineExclamationCircle className="mr-1 h-4 w-4" />
              {errors.priority}
            </div>
          ) : (
            <div className="flex items-center mt-1">
              <div
                className="w-3 h-3 rounded-full mr-1"
                style={{
                  backgroundColor: `var(--flowbite-${getPriorityColor(formData.priority)}-500)`,
                }}
              ></div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formData.priority === 'HIGH'
                  ? 'Memerlukan penanganan segera'
                  : formData.priority === 'MEDIUM'
                    ? 'Penanganan dalam waktu dekat'
                    : 'Penanganan sesuai antrian'}
              </p>
            </div>
          )}
        </div>

        {/* OPD Tujuan */}
        <div className="space-y-1">
          <Label
            htmlFor="opdId"
            className="flex items-center text-gray-700 dark:text-gray-300"
          >
            <HiOfficeBuilding className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
            OPD Tujuan <span className="text-red-500 ml-1">*</span>
          </Label>

          {loadingOpds ? (
            <div className="flex items-center justify-center py-8">
              <Spinner size="sm" className="mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Memuat daftar OPD...
              </span>
            </div>
          ) : (
            <>
              <ReactSelect
                id="opdId"
                name="opdId"
                className="text-sm"
                placeholder="Pilih OPD"
                isDisabled={loadingOpds}
                options={opds.map((opd) => ({
                  label: opd.name,
                  value: opd.id.toString(),
                }))}
                value={opds
                  .map((opd) => ({
                    label: opd.name,
                    value: opd.id.toString(),
                  }))
                  .find((o) => o.value === formData.opdId)}
                onChange={handleOpdChange}
                isClearable
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />

              {errors.opdId ? (
                <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400">
                  <HiOutlineExclamationCircle className="mr-1 h-4 w-4" />
                  {errors.opdId}
                </div>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Pilih instansi yang sesuai dengan pengaduan Anda
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Step1;
