'use client';

import { HiOutlineMail } from 'react-icons/hi';

export default function LoadingMail({ label }) {
  return (
    <div className="flex justify-center items-center p-12">
      <div className="animate-pulse flex flex-col items-center">
        <HiOutlineMail className="h-12 w-12 text-blue-300 mb-4" />
        <div className="h-4 bg-blue-200 rounded w-32 mb-2" />
        <div className="h-3 bg-blue-100 rounded w-24" />
        {label && (
          <p className="mt-4 text-sm text-blue-500 text-center">{label}</p>
        )}
      </div>
    </div>
  );
}