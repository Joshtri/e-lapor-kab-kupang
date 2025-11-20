'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  HiChevronDown,
  HiX,
  HiSearch,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';

/**
 * SearchableSelect Component
 * A fully custom autocomplete/searchable dropdown without external dependencies
 *
 * @example
 * <SearchableSelect
 *   label="Select Category"
 *   options={[
 *     { label: 'Option 1', value: 'opt1' },
 *     { label: 'Option 2', value: 'opt2' },
 *   ]}
 *   value={selectedValue}
 *   onChange={handleChange}
 *   placeholder="Search options..."
 *   error={errorMessage}
 * />
 */
export default function SearchableSelect({
  id,
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Search...',
  error,
  required = false,
  disabled = false,
  clearable = true,
  isLoading = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = useCallback(() => {
    if (!searchTerm.trim()) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [options, searchTerm]);

  const filtered = filteredOptions();

  // Get selected option label
  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption?.label || '';

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filtered.length - 1 ? prev + 1 : prev,
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
          handleSelect(filtered[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Handle option selection
  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  // Handle clear
  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Field */}
      <div
        className={`relative w-full flex items-center bg-white dark:bg-gray-700 border rounded-lg transition-colors ${
          error
            ? 'border-red-500 dark:border-red-500'
            : isOpen
              ? 'border-blue-500 dark:border-blue-400'
              : 'border-gray-300 dark:border-gray-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {/* Search Icon */}
        <HiSearch className="absolute left-3 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />

        {/* Input or Display */}
        {isOpen ? (
          <input
            ref={inputRef}
            id={id}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setHighlightedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus
            className="w-full pl-10 pr-10 py-2.5 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-sm"
          />
        ) : (
          <input
            ref={inputRef}
            id={id}
            type="text"
            value={displayLabel}
            onClick={() => !disabled && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            readOnly
            placeholder={placeholder}
            disabled={disabled}
            className="w-full pl-10 pr-10 py-2.5 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none cursor-pointer text-sm"
          />
        )}

        {/* Clear Button */}
        {clearable && value && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-10 h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Clear selection"
          >
            <HiX />
          </button>
        )}

        {/* Dropdown Icon */}
        <div
          className={`absolute right-3 text-gray-400 dark:text-gray-500 pointer-events-none transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <HiChevronDown className="h-5 w-5" />
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400">
          <HiOutlineExclamationCircle className="mr-1 h-4 w-4" />
          {error}
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-56 overflow-y-auto"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
              Tidak ada opsi yang cocok
            </div>
          ) : (
            <ul className="py-1">
              {filtered.map((option, index) => (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      highlightedIndex === index
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100'
                        : value === option.value
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100 font-medium'
                          : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
