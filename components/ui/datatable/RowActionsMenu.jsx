'use client';

import { useState, useRef, useEffect } from 'react';
import { HiEllipsisVertical } from 'react-icons/hi2';
import { Button } from 'flowbite-react';

const RowActionsMenu = ({ actions, item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!actions || actions.length === 0) {
    return null;
  }

  const handleActionClick = (action) => {
    action.onClick?.(item);
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className="relative inline-block">
      <Button
        size="xs"
        color="gray"
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 hover:opacity-90"
        title="Aksi Lainnya"
      >
        <HiEllipsisVertical className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          {actions.map((action, idx) => {
            const Icon = action.icon;
            const colorMap = {
              blue: 'text-blue-500',
              cyan: 'text-cyan-500',
              purple: 'text-purple-500',
              red: 'text-red-500',
              green: 'text-green-500',
              amber: 'text-amber-500',
              gray: 'text-gray-500',
            };
            const iconColor = colorMap[action.color] || colorMap.gray;
            return (
              <button
                key={idx}
                onClick={() => handleActionClick(action)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
                title={action.tooltip}
              >
                {Icon && (
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                )}
                <span>{action.tooltip}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RowActionsMenu;
