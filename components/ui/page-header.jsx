"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { HiArrowLeft, HiSearch, HiX } from "react-icons/hi";
import Breadcrumbs from "@/components/ui/breadcrumbs";

export default function PageHeader({
  title,
  backHref = "/",
  showSearch = false,
  searchQuery = "",
  onSearchChange = () => {},
  breadcrumbsProps = {},
}) {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (showSearchBar) {
      inputRef.current?.focus();
    }
  }, [showSearchBar]);

  return (
    <section className="mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          <HiArrowLeft className="w-4 h-4" />
          Kembali
        </Link>

        {showSearch &&
          (showSearchBar ? (
            <div className="relative w-full md:w-auto">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari laporan..."
                className="w-full md:w-64 px-4 py-2 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:placeholder-gray-400"
              />
              <button
                onClick={() => setShowSearchBar(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <HiX className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearchBar(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              <HiSearch className="w-5 h-5" />
              Cari
            </button>
          ))}
      </div>

      <Breadcrumbs {...breadcrumbsProps} />
      <hr className="mt-4" />

      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-4">
        {title}
      </h1>
    </section>
  );
}
