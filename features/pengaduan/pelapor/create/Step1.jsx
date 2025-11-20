'use client';

import { useState } from 'react';
import { Label, Select, Spinner } from 'flowbite-react';
import {
  HiTag,
  HiFlag,
  HiOfficeBuilding,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';
import { motion } from 'framer-motion';
import { TextInput as FlowbiteTextInput } from 'flowbite-react';
import SearchableSelect from '@/components/ui/inputs/SearchableSelect';
import {
  getMainCategories,
  getSubcategoriesByText,
} from '@/utils/reportCategories';
import { getPriorityColor } from '@/utils/common';
import { useOpdList } from './hooks';

const Step1 = ({ formData, onFormChange, errors }) => {
  const [selectedCategory, setSelectedCategory] = useState(formData.category);
  const [subcategory, setSubcategory] = useState('');
  const { data: opds = [], isLoading: loadingOpds } = useOpdList();

  const handleCategoryChange = (value) => {
    onFormChange('category', value);
    setSelectedCategory(value);
    setSubcategory('');
  };

  const handleSubcategoryChange = (value) => {
    setSubcategory(value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormChange(name, value);
  };

  const handlePriorityChange = (e) => {
    onFormChange('priority', e.target.value);
  };

  const handleOpdChange = (value) => {
    onFormChange('opdId', value);
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
          <FlowbiteTextInput
            id="title"
            name="title"
            placeholder="Masukkan judul pengaduan..."
            value={formData.title}
            onChange={handleInputChange}
            color={errors.title ? 'failure' : 'gray'}
          />
          {errors.title && (
            <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400">
              <HiOutlineExclamationCircle className="mr-1 h-4 w-4" />
              {errors.title}
            </div>
          )}
          {!errors.title && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Berikan judul yang singkat dan jelas tentang pengaduan Anda
            </p>
          )}
        </div>

        {/* Kategori */}
        <SearchableSelect
          id="category"
          label={
            <Label className="flex items-center text-gray-700 dark:text-gray-300">
              <HiTag className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
              Kategori Pengaduan <span className="text-red-500 ml-1">*</span>
            </Label>
          }
          options={getMainCategories()}
          value={formData.category}
          onChange={handleCategoryChange}
          placeholder="Cari kategori..."
          error={errors.category}
          required
          clearable
        />

        {/* Subkategori */}
        {selectedCategory && (
          <SearchableSelect
            id="subcategory"
            label="Subkategori"
            options={getSubcategoriesByText(selectedCategory)}
            value={subcategory}
            onChange={handleSubcategoryChange}
            placeholder="Cari subkategori..."
            error={errors.subcategory}
            required
            clearable
          />
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
        <SearchableSelect
          id="opdId"
          label={
            <Label className="flex items-center text-gray-700 dark:text-gray-300">
              <HiOfficeBuilding className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
              OPD Tujuan <span className="text-red-500 ml-1">*</span>
            </Label>
          }
          options={opds.map((opd) => ({
            label: opd.name,
            value: opd.id.toString(),
          }))}
          value={formData.opdId}
          onChange={handleOpdChange}
          placeholder="Cari OPD..."
          error={errors.opdId}
          required
          disabled={loadingOpds}
          isLoading={loadingOpds}
          clearable
        />
      </div>
    </motion.div>
  );
};

export default Step1;
