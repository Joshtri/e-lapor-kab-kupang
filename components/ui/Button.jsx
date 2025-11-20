'use client';

import Link from 'next/link';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

/**
 * Flexible Button Component
 *
 * Supports multiple variants, sizes, and can render as button or link
 * with optional start/end icons
 *
 * @example
 * // Basic button
 * <Button>Click me</Button>
 *
 * // Button with icon
 * <Button startIcon={<IconComponent />}>Action</Button>
 *
 * // Icon-only button
 * <Button isIconOnly><IconComponent /></Button>
 *
 * // As a link
 * <Button as="link" href="/path">Go</Button>
 */
const Button = forwardRef((
  {
    // Content
    children,
    startIcon,
    endIcon,
    isIconOnly = false,

    // Styling variants
    variant = 'solid',
    color = 'primary',
    size = 'md',
    rounded = 'md',

    // Behavior
    as = 'button',
    href,
    type = 'button',
    disabled = false,
    loading = false,

    // Icon alignment
    iconPosition = 'start',
    iconSize = 'auto',

    // Custom classes
    className = '',

    // Event handlers
    onClick,
    ...rest
  },
  ref
) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

  // Size variants
  const sizes = {
    xs: 'px-2 py-1 text-xs gap-1',
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
    xl: 'px-8 py-4 text-xl gap-3',
  };

  // Icon-only sizes
  const iconOnlySizes = {
    xs: 'p-1.5 text-xs',
    sm: 'p-1.5 text-sm',
    md: 'p-2 text-base',
    lg: 'p-3 text-lg',
    xl: 'p-4 text-xl',
  };

  // Rounded variants
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  // Color variants for solid style
  const solidColors = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
    info: 'bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500',
    ghost: 'bg-transparent text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-300 dark:focus:ring-gray-600',
    light: 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-300 dark:focus:ring-gray-600',
  };

  // Color variants for outline style
  const outlineColors = {
    primary: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:ring-blue-500',
    secondary: 'border-2 border-gray-600 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/20 focus:ring-gray-500',
    success: 'border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 focus:ring-green-500',
    danger: 'border-2 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 focus:ring-red-500',
    warning: 'border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 focus:ring-yellow-500',
    info: 'border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 focus:ring-cyan-500',
    ghost: 'border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-300 dark:focus:ring-gray-600',
    light: 'border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-300 dark:focus:ring-gray-600',
  };

  // Color variants for text/soft style
  const textColors = {
    primary: 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:ring-blue-500',
    secondary: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500',
    success: 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 focus:ring-green-500',
    danger: 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:ring-red-500',
    warning: 'text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 focus:ring-yellow-500',
    info: 'text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 focus:ring-cyan-500',
    ghost: 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-300 dark:focus:ring-gray-600',
    light: 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-300 dark:focus:ring-gray-600',
  };

  // Determine color classes based on variant
  const colorClasses = {
    solid: solidColors[color] || solidColors.primary,
    outline: outlineColors[color] || outlineColors.primary,
    text: textColors[color] || textColors.primary,
  }[variant] || solidColors[color];

  // Icon size utilities
  const iconSizeClass = iconSize === 'auto'
    ? size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : size === 'lg' ? 'w-6 h-6' : 'w-7 h-7'
    : iconSize;

  // Combine all classes
  const buttonClasses = `
    ${baseStyles}
    ${isIconOnly ? iconOnlySizes[size] : sizes[size]}
    ${roundedStyles[rounded]}
    ${colorClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Render icon with proper sizing
  const renderIcon = (icon) => {
    if (!icon) return null;
    return typeof icon === 'string' ? (
      <span className={iconSizeClass}>{icon}</span>
    ) : (
      <span className={`flex items-center justify-center ${iconSizeClass}`}>
        {icon}
      </span>
    );
  };

  // Content for button/link
  const content = (
    <>
      {isIconOnly ? (
        renderIcon(children || startIcon)
      ) : (
        <>
          {iconPosition === 'start' && renderIcon(startIcon)}
          {loading ? <span className="animate-spin">⏳</span> : children}
          {iconPosition === 'end' && renderIcon(endIcon)}
        </>
      )}
    </>
  );

  // Render as link
  if (as === 'link') {
    return (
      <Link href={href || '#'} className={buttonClasses}>
        {content}
      </Link>
    );
  }

  // Render as button
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={buttonClasses}
      {...rest}
    >
      {content}
    </button>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  // Content
  children: PropTypes.node,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  isIconOnly: PropTypes.bool,

  // Styling variants
  variant: PropTypes.oneOf(['solid', 'outline', 'text']),
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'ghost',
    'light',
  ]),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'full']),

  // Behavior
  as: PropTypes.oneOf(['button', 'link']),
  href: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,

  // Icon alignment
  iconPosition: PropTypes.oneOf(['start', 'end']),
  iconSize: PropTypes.string,

  // Custom classes
  className: PropTypes.string,

  // Event handlers
  onClick: PropTypes.func,
};

export default Button;
