'use client';

import { useState, useEffect } from 'react';
import { TextInput, Label } from 'flowbite-react';
import { HiOutlineIdentification, HiEye, HiEyeOff } from 'react-icons/hi';

export default function MaskedNikInput({
  value = '', // default untuk menghindari uncontrolled warning
  onChange,
  error,
  helperText = '',
  id = 'nikNumber',
}) {
  const [localValue, setLocalValue] = useState(value);
  const [isMasked, setIsMasked] = useState(false);
  const [showTemporarily, setShowTemporarily] = useState(false);

  // Sync prop to local state (biar bisa di-reset dari luar)
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  useEffect(() => {
    if (localValue?.length === 16) {
      setIsMasked(true);
    } else {
      setIsMasked(false);
    }
  }, [localValue]);

  useEffect(() => {
    if (showTemporarily) {
      const timer = setTimeout(() => {
        setShowTemporarily(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showTemporarily]);

  const handleChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setLocalValue(raw);
    onChange?.(raw); // kirim ke parent
  };

  const getMaskedValue = () => {
    if (!localValue || localValue.length < 4) return localValue;
    return '*'.repeat(localValue.length - 4) + localValue.slice(-4);
  };

  return (
    <div>
      <Label htmlFor={id} className="mb-2 flex gap-2 items-center">
        <HiOutlineIdentification className="h-4 w-4 text-blue-600" />
        <span>Nomor Identitas (NIK)</span>
      </Label>

      <div className="relative">
        <TextInput
          id={id}
          type="text"
          inputMode="numeric"
          maxLength={16}
        
          value={isMasked && !showTemporarily ? getMaskedValue() : localValue}
          onChange={handleChange}
          color={error ? 'failure' : 'gray'}
          helperText={error || helperText}
         />

        {isMasked && (
          <button
            type="button"
            onClick={() => setShowTemporarily(true)}
            className="absolute right-2 top-2 text-gray-600"
          >
            {showTemporarily ? <HiEyeOff size={18} /> : <HiEye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
