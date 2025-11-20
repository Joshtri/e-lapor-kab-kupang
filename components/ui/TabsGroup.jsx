"use client"

import React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { HiOutlineMail, HiOutlineChartBar, HiOutlineClipboardList, HiOutlineOfficeBuilding } from "react-icons/hi"



const TabsComponent = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0)

  // Map tab titles to icons
  const getTabIcon = (title) => {
    if (title.includes("Ikhtisar")) return <HiOutlineMail className="w-5 h-5" />
    if (title.includes("Statistik")) return <HiOutlineChartBar className="w-5 h-5" />
    if (title.includes("Laporan")) return <HiOutlineClipboardList className="w-5 h-5" />
    if (title.includes("Kinerja")) return <HiOutlineOfficeBuilding className="w-5 h-5" />
    return <HiOutlineMail className="w-5 h-5" /> // Default icon
  }

  return (
    <div className="mt-6">
      {/* Tabs header styled like mail tabs */}
      <div className="flex overflow-x-auto space-x-1 border-b border-gray-200 dark:border-gray-700 mb-6">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`
              flex items-center gap-2 px-4 py-3 font-medium text-sm rounded-t-lg transition-colors
              ${
                activeTab === index
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }
            `}
          >
            {getTabIcon(tab.title)}
            {tab.title}
          </button>
        ))}
      </div>

      {/* Tab content with animation */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {tabs[activeTab].content}
      </motion.div>
    </div>
  )
}

export default TabsComponent

