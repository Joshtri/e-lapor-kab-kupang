"use client";

import React, { useState } from "react";

const TabsComponent = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      {/* 🔹 Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <ul className="flex justify-start space-x-4 text-sm font-medium text-gray-500 dark:text-gray-400">
          {tabs.map((tab, index) => (
            <li key={index}>
              <button
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2 text-lg border-b-2 font-semibold transition-all duration-300 ease-in-out ${
                  activeTab === index
                    ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                    : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                }`}
              >
                {tab.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 🔹 Tabs Content */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-4 transition-opacity duration-300 ease-in-out">
        {tabs[activeTab] && tabs[activeTab].content}
      </div>
    </div>
  );
};

export default TabsComponent;
