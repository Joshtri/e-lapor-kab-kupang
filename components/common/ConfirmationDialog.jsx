'use client';

import { Modal, Button } from 'flowbite-react';
import { HiExclamation } from 'react-icons/hi';
import PropTypes from 'prop-types';

/**
 * Reusable Confirmation Dialog Component
 *
 * Usage Example:
 * <ConfirmationDialog
 *   isOpen={openDelete}
 *   title="Hapus Item?"
 *   message={<>Apakah Anda yakin ingin menghapus <strong>{itemName}</strong>?</>}
 *   confirmText="Ya, Hapus"
 *   cancelText="Batal"
 *   confirmColor="red"
 *   isLoading={isDeleting}
 *   onConfirm={handleDelete}
 *   onCancel={() => setOpenDelete(false)}
 * />
 */
export default function ConfirmationDialog({
  isOpen = false,
  title = 'Konfirmasi',
  message = 'Apakah Anda yakin?',
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  confirmColor = 'red',
  isLoading = false,
  onConfirm = () => {},
  onCancel = () => {},
  icon: Icon = HiExclamation,
  size = 'md',
}) {
  return (
    <Modal
      show={isOpen}
      size={size}
      onClose={() => {
        if (!isLoading) {
          onCancel();
        }
      }}
      popup
    >
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <Icon className="h-14 w-14 text-red-500" />
          </div>

          {/* Title */}
          {title && (
            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">
              {title}
            </h3>
          )}

          {/* Message */}
          <div className="mb-5 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            {message}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button
              color={confirmColor}
              onClick={onConfirm}
              disabled={isLoading}
              isProcessing={isLoading}
              className="flex-1"
            >
              {isLoading ? `${confirmText}...` : confirmText}
            </Button>
            <Button
              color="gray"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1"
            >
              {cancelText}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

ConfirmationDialog.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmColor: PropTypes.string,
  isLoading: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  icon: PropTypes.elementType,
  size: PropTypes.string,
};
