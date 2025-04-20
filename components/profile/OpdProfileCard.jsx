import { motion } from 'framer-motion';
import { HiOfficeBuilding, HiOutlineOfficeBuilding } from 'react-icons/hi';
import { Card } from 'flowbite-react';
import { OpdProfileField } from './OpdProfileField';

export const OpdProfileCard = ({ opd }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
    <Card className="overflow-hidden border-0 shadow-md">
      <div className="relative bg-gradient-to-r from-purple-500 to-indigo-500 p-4 sm:p-6 pb-12 sm:pb-16 dark:from-purple-700 dark:to-indigo-700">
        <div className="flex items-center gap-2">
          <HiOfficeBuilding className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Profil OPD
          </h2>
        </div>
      </div>

      <div className="relative px-4 sm:px-6 pb-6">
        <div className="absolute -top-8 sm:-top-10 left-4 right-4 sm:left-6 sm:right-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 border border-gray-100 dark:border-gray-700">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 break-words">
              {opd?.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center flex-wrap">
              <HiOutlineOfficeBuilding className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-purple-500 dark:text-purple-400" />
              Organisasi Perangkat Daerah
            </p>
          </div>
        </div>

        <div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <OpdProfileField
            icon={HiOutlineLocationMarker}
            color="indigo"
            label="Alamat"
            value={opd?.alamat}
          />
          <OpdProfileField
            icon={HiOutlineMail}
            color="pink"
            label="Email Instansi"
            value={opd?.email}
          />
          <OpdProfileField
            icon={HiOutlinePhone}
            color="cyan"
            label="Telepon"
            value={opd?.telp}
          />
          <OpdProfileField
            icon={HiOutlineGlobe}
            color="emerald"
            label="Website"
            value={opd?.website}
            isLink={true}
          />
        </div>
      </div>
    </Card>
  </motion.div>
);
