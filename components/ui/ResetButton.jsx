'use client';

import { Button } from 'flowbite-react';
import { HiOutlineRefresh } from 'react-icons/hi';
import PropTypes from 'prop-types';

/**
 * Komponen ResetButton
 *
 * @param {Function} onReset - Fungsi yang dijalankan saat tombol diklik (biasanya reset dari useForm)
 * @param {Boolean} disabled - Opsional, untuk menonaktifkan tombol
 * @param {String} className - Opsional, untuk styling tambahan
 */
const ResetButton = ({ onReset, disabled = false, className = '' }) => {
  return (
    <Button
      color="gray"
      outline
      size="sm"
      onClick={onReset}
      disabled={disabled}
      className={`flex items-center gap-1 ${className}`}
    >
      <HiOutlineRefresh className="w-4 h-4" />
      Reset
    </Button>
  );
};

export default ResetButton;

ResetButton.propTypes = {
  onReset: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
