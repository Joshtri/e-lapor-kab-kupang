"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiChevronRight } from "react-icons/hi";

export default function Breadcrumbs({ customRoutes = {}, home = { label: "Home", href: "/" } }) {
  const pathname = usePathname();

  const pathSegments = pathname
    .split("/")
    .filter((segment) => segment.length > 0);

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center text-sm text-gray-600 dark:text-gray-300 space-x-1">
        <li>
          <Link href={home.href} className="hover:underline">
            {home.label}
          </Link>
        </li>

        {pathSegments.map((segment, index) => {
          const defaultHref = "/" + pathSegments.slice(0, index + 1).join("/");
          const isLast = index === pathSegments.length - 1;

          const customRoute = customRoutes[segment] || {};
          const label = customRoute.label || decodeURIComponent(segment);
          const href = customRoute.href || defaultHref;

          return (
            <li key={href} className="flex items-center space-x-1">
              <HiChevronRight className="w-4 h-4" />
              {isLast ? (
                <span className="capitalize text-gray-500 dark:text-gray-400">
                  {label}
                </span>
              ) : (
                <Link href={href} className="hover:underline capitalize">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
