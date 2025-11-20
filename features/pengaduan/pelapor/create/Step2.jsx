'use client';

import { Label, FileInput, Badge, TextInput as FlowbiteTextInput } from 'flowbite-react';
import {
  HiOutlineMail,
  HiOutlinePhotograph,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';
import { motion } from 'framer-motion';

const Step2 = ({
  formData,
  files,
  onFormChange,
  onFilesChange,
  errors,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormChange(name, value);
  };

  const handleFileChange = (e) => {
    onFilesChange(Array.from(e.target.files));
  };

  const removeFile = (index) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-6">
        {/* Deskripsi */}
        <div className="space-y-2">
          <Label
            htmlFor="description"
            className="flex items-center text-gray-700 dark:text-gray-300"
          >
            <HiOutlineMail className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
            Deskripsi Pengaduan{' '}
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <textarea
            id="description"
            name="description"
            placeholder="Jelaskan permasalahan yang Anda alami secara detail..."
            rows={5}
            value={formData.description}
            onChange={handleInputChange}
            required
            className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.description
                ? 'border-red-500 dark:border-red-500'
                : 'border-gray-300'
            }`}
          />
          {errors.description ? (
            <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400">
              <HiOutlineExclamationCircle className="mr-1 h-4 w-4" />
              {errors.description}
            </div>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Berikan informasi selengkap mungkin termasuk lokasi, waktu
              kejadian, dan detail lainnya
            </p>
          )}
        </div>

        {/* Lokasi */}
        <div className="space-y-2">
          <Label
            htmlFor="location"
            className="flex items-center text-gray-700 dark:text-gray-300"
          >
            <HiOutlinePhotograph className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
            Lokasi <span className="text-red-500 ml-1">*</span>
          </Label>
          <FlowbiteTextInput
            id="location"
            name="location"
            placeholder="Contoh: Jalan Ahmad Yani, Kelurahan Oesapa, Kecamatan Kelapa Lima"
            value={formData.location}
            onChange={handleInputChange}
            color={errors.location ? 'failure' : 'gray'}
          />
          {errors.location && (
            <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400">
              <HiOutlineExclamationCircle className="mr-1 h-4 w-4" />
              {errors.location}
            </div>
          )}
        </div>

        {/* Lampiran */}
        <div className="space-y-2">
          <Label
            htmlFor="files"
            className="flex items-center text-gray-700 dark:text-gray-300"
          >
            <HiOutlinePhotograph className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
            Lampiran (Opsional)
          </Label>
          <FileInput
            id="files"
            multiple
            onChange={handleFileChange}
            helperText="Upload foto atau dokumen pendukung (maks. 5MB per file)"
            accept="image/*"
            className="border-gray-300 dark:border-gray-600"
          />

          {files.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                File yang dipilih ({files.length}):
              </p>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <HiOutlinePhotograph className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({(file.size / 1024).toFixed(2)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm ml-2"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Step2;
