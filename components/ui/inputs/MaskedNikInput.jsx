'use client';

import { useState, useEffect } from 'react';
import { TextInput, Label } from 'flowbite-react';
import { HiOutlineIdentification, HiEye, HiEyeOff } from 'react-icons/hi';

export default function MaskedNikInput({
  value = '',
  onChange,
  error,
  helperText = '',
  id = 'nikNumber',
  type = 'NIK', // 'NIK' | 'NIP'
}) {
  const [localValue, setLocalValue] = useState(value || '');
  const [isMasked, setIsMasked] = useState(false);
  const [showTemporarily, setShowTemporarily] = useState(false);

  const maxLength = type === 'NIP' ? 18 : 16;

  useEffect(() => {
    setLocalValue(typeof value === 'string' ? value : '');
  }, [value]);

  useEffect(() => {
    if (typeof localValue === 'string' && localValue.length === maxLength) {
      setIsMasked(true);
    } else {
      setIsMasked(false);
    }
  }, [localValue, maxLength]);

  useEffect(() => {
    if (showTemporarily) {
      const timer = setTimeout(() => setShowTemporarily(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showTemporarily]);

  const handleChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setLocalValue(raw);
    onChange?.(raw);
  };

  const getMaskedValue = () => {
    if (typeof localValue !== 'string' || localValue.length < 4)
      return localValue || '';
    return '*'.repeat(localValue.length - 4) + localValue.slice(-4);
  };

  return (
    <div>
      <Label htmlFor={id} className="mb-2 flex gap-2 items-center">
        <HiOutlineIdentification className="h-4 w-4 text-blue-600" />
        <span>
          {type === 'NIP'
            ? 'Nomor Induk Pegawai (NIP)'
            : 'Nomor Induk Kependudukan (NIK)'}{' '}
          <span className="text-red-500">*</span>
        </span>
      </Label>

      <div className="relative">
        <TextInput
          id={id}
          type="text"
          inputMode="numeric"
          maxLength={maxLength}
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
