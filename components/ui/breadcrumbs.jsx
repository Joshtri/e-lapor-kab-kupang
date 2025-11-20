'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiChevronRight } from 'react-icons/hi';
import PropTypes from 'prop-types';
import { getSegmentLabel, getRoleHomePath } from '@/config/breadcrumbConfig';

const Breadcrumbs = ({
  customRoutes = {}, // Optional: for overriding specific segment labels
  home = null, // Optional: custom home config
  role = 'adm', // Default role
}) => {
  const pathname = usePathname();

  // Get role-specific home path with fallback
  const defaultHome = { label: 'Beranda', href: '/adm/dashboard' };
  const homeConfig = home || getRoleHomePath(role) || defaultHome;

  // Ensure homeConfig has valid properties
  if (!homeConfig.href || !homeConfig.label) {
    return null; // Fail gracefully
  }

  // Split pathname and filter out empty segments
  const pathSegments = pathname
    .split('/')
    .filter((segment) => segment.length > 0);

  // Initialize breadcrumb items with the home link
  const breadcrumbItems = [{ label: homeConfig.label, href: homeConfig.href }];

  // Get role root segments to skip (e.g., 'adm' for admin, 'bupati-portal' for bupati)
  const roleRootSegments = homeConfig.href
    .split('/')
    .filter((segment) => segment.length > 0 && segment !== 'dashboard');

  // Build breadcrumb items from path segments, skipping role root segments
  let cumulativePath = '';
  pathSegments.forEach((segment) => {
    // Build the cumulative path
    cumulativePath += `/${segment}`;

    // Skip if segment is part of role root path (implicit in home)
    if (roleRootSegments.includes(segment)) {
      return;
    }

    // Skip if path matches home path (avoid duplication)
    if (cumulativePath === homeConfig.href) {
      return;
    }

    // Get label: first check customRoutes, then use config, then auto-generate
    let label;
    if (customRoutes[segment]?.label) {
      label = customRoutes[segment].label;
    } else {
      label = getSegmentLabel(segment);
    }

    // Get href: first check customRoutes, then use cumulative path
    const itemHref = customRoutes[segment]?.href || cumulativePath;

    // Only add if href is valid (not undefined or empty)
    if (itemHref && typeof itemHref === 'string') {
      breadcrumbItems.push({
        label: label || 'Halaman',
        href: itemHref,
      });
    }
  });

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center text-sm text-gray-600 dark:text-gray-300 space-x-1">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          return (
            <li key={`breadcrumb-${index}-${item.href}`} className="flex items-center space-x-1">
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
  role: PropTypes.oneOf(['adm', 'bupati', 'opd', 'pelapor']),
};

export default Breadcrumbs;
