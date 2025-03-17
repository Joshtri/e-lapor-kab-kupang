"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BsArrowDownUp } from "react-icons/bs";

export default function FloatingNavbarButton({ onShowNavbar, showButton }) {
  return (
    <AnimatePresence>
      {showButton && (
        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          onClick={onShowNavbar}
          className="fixed bottom-40 right-6 p-3 rounded-full bg-yellow-500 text-black shadow-lg hover:bg-yellow-600 transition-all z-50"
        >
          <BsArrowDownUp className="h-6 w-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
