import React from "react";
import { motion } from "framer-motion";

const StatCard = ({ icon, color, title, value }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.03 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 relative"
    >
      {/* Envelope flap */}
      <div className={`h-2 ${color.replace('text-', 'bg-')}`}></div>
      
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
          </div>
          <div className={`${color} p-3 rounded-full bg-opacity-20 dark:bg-opacity-20 ${color.replace('text-', 'bg-')}`}>
            {icon}
          </div>
        </div>
        
        {/* Envelope stamp-like decoration */}
        <div className="absolute bottom-2 right-2 opacity-10">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M8 12H16M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
