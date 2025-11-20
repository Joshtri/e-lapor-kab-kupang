'use client';

import { TextInput as FlowbiteTextInput } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function TextInput({
  id,
  name,
  placeholder,
  value,
  onChange,
  error,
  required,
  disabled,
  type = 'text',
  ...props
}) {
  return (
    <div className="w-full">
      <FlowbiteTextInput
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        color={error ? 'failure' : 'gray'}
        {...props}
      />
      {error && (
        <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400">
          <HiOutlineExclamationCircle className="mr-1 h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}
