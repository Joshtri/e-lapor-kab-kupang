import clsx from 'clsx';

const colorVariants = {
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  purple: 'bg-purple-100 text-purple-800',
  indigo: 'bg-indigo-100 text-indigo-800',
  red: 'bg-red-100 text-red-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  gray: 'bg-gray-100 text-gray-800',
};

export default function CustomBadge({
  children,
  color = 'gray',
  size = 'sm',
  className = '',
}) {
  const sizeVariants = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  return (
    <span
      className={clsx(
        'inline-block font-medium rounded-full',
        colorVariants[color],
        sizeVariants[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
