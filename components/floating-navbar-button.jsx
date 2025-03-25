"use client"

import { motion, AnimatePresence } from "framer-motion"
import { HiOutlineArrowUp, HiOutlineMail } from "react-icons/hi"

export default function FloatingNavbarButton({ onShowNavbar, showButton }) {
  return (
    <AnimatePresence>
      {showButton && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={onShowNavbar}
          className="fixed top-4 right-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
          aria-label="Show Navigation"
        >
          <div className="relative">
            <HiOutlineMail className="h-5 w-5" />
            <motion.div
              animate={{ y: [-2, 0, -2] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
              className="absolute -top-1 -right-1"
            >
              <HiOutlineArrowUp className="h-3 w-3" />
            </motion.div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

