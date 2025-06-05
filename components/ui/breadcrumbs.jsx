'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiChevronRight } from 'react-icons/hi';
import PropTypes from 'prop-types';

const Breadcrumbs = ({
  customRoutes = {},
  home = null, // Allow null to use role-based default
  role = 'adm', // Default role
}) => {
  const pathname = usePathname();

  // Define role-specific root paths and home labels
  const roleConfig = {
    adm: { path: '/adm/dashboard', label: 'Beranda' },
    bupati: { path: '/bupati-portal/dashboard', label: 'Beranda' },
    opd: { path: '/opd/dashboard', label: 'Beranda' },
  };

  // Get the root path and label based on the role
  const { path: roleRootPath, label: roleHomeLabel } =
    roleConfig[role] || roleConfig.adm;

  // Use provided home prop or fall back to role-based home
  const homeConfig = home || { label: roleHomeLabel, href: roleRootPath };

  // Split pathname and filter out empty segments
  const pathSegments = pathname
    .split('/')
    .filter((segment) => segment.length > 0);

  // Initialize breadcrumb items with the home link
  const breadcrumbItems = [{ label: homeConfig.label, href: homeConfig.href }];

  // Check if the pathname starts with the role's root path
  const isRolePath = pathname.startsWith(roleRootPath);
  let remainingSegments = pathSegments;

  // If the path includes the role's root, skip those segments
  if (isRolePath) {
    const roleRootSegments = roleRootPath
      .split('/')
      .filter((s) => s.length > 0);
    remainingSegments = pathSegments.slice(roleRootSegments.length);
  }

  // Process remaining segments
  remainingSegments.forEach((segment, index) => {
    // Skip segments that match the home label (case-insensitive) to avoid duplication
    if (segment.toLowerCase() === homeConfig.label.toLowerCase()) {
      return;
    }

    // Generate href for the current segment
    const href = isRolePath
      ? `${roleRootPath}/${remainingSegments.slice(0, index + 1).join('/')}`
      : `/${pathSegments.slice(0, pathSegments.length - remainingSegments.length + index + 1).join('/')}`;

    // Check if the segment is an ID (numbers or UUID-like strings)
    const isId = /^[0-9]+$/.test(segment) || segment.includes('-');

    // Use custom route if provided, otherwise generate a label
    const customRoute = customRoutes[segment] || {};
    const label =
      customRoute.label ||
      (isId
        ? 'Detail'
        : decodeURIComponent(segment)
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase()));

    // Avoid adding duplicate home label
    if (label.toLowerCase() !== homeConfig.label.toLowerCase()) {
      breadcrumbItems.push({
        label,
        href: customRoute.href || href,
      });
    }
  });

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center text-sm text-gray-600 dark:text-gray-300 space-x-1">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          return (
            <li key={item.href} className="flex items-center space-x-1">
              {index > 0 && <HiChevronRight className="w-4 h-4" />}
              {isLast ? (
                <span className="capitalize text-gray-500 dark:text-gray-400">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:underline capitalize">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumbs.propTypes = {
  customRoutes: PropTypes.objectOf(
    PropTypes.shape({
      label: PropTypes.string,
      href: PropTypes.string,
    }),
  ),
  home: PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
  }),
  role: PropTypes.oneOf(['adm', 'bupati', 'opd']),
};

export default Breadcrumbs;
