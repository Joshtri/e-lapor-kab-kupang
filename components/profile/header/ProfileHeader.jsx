import { motion } from 'framer-motion';

export const ProfileHeader = () => (
  <motion.div 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center mb-4"
  >
    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">
      Manajemen Profil
    </h1>
    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
      Kelola informasi profil dan akun Anda
    </p>
  </motion.div>
);