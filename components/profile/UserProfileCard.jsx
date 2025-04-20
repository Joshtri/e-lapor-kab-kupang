import { motion } from 'framer-motion';
import { HiOutlineKey } from 'react-icons/hi';
import { Button, Card, Badge, Avatar } from 'flowbite-react';
import { UserProfileField } from './UserProfileField';

export const UserProfileCard = ({ user, onPasswordChange }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'OPD':
        return 'purple';
      case 'ADMIN':
        return 'red';
      default:
        return 'blue';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="overflow-hidden border-0 shadow-md">
        <div className="relative bg-gradient-to-r from-blue-500 to-cyan-400 p-4 sm:p-6 pb-16 sm:pb-24 dark:from-blue-700 dark:to-cyan-600">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Profil Pengguna
            </h2>
            {user?.role && (
              <Badge
                color={getRoleColor(user.role)}
                size="sm"
                className="font-medium"
              >
                {user.role}
              </Badge>
            )}
          </div>
        </div>

        <div className="relative px-4 sm:px-6 pb-6">
          <div className="absolute -top-12 sm:-top-16 left-4 sm:left-6 flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-0">
            <div className="bg-white dark:bg-gray-700 p-1 rounded-full shadow-lg">
              <Avatar
                size="md"
                rounded
                placeholderInitials={getInitials(user?.name)}
                className="ring-4 ring-white dark:ring-gray-700 bg-blue-100 dark:bg-blue-900"
              />
            </div>
            <div className="sm:ml-4 sm:mb-2">
              <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white break-words">
                {user?.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Bergabung sejak{' '}
                {new Date(user?.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UserProfileField
              icon={HiOutlineMail}
              color="blue"
              label="Email"
              value={user?.email}
            />
            <UserProfileField
              icon={HiOutlinePhone}
              color="green"
              label="Nomor Kontak"
              value={user?.contactNumber}
            />
            <UserProfileField
              icon={HiOutlineIdentification}
              color="purple"
              label="NIK / NIP"
              value={user?.nikNumber}
            />
            <UserProfileField
              icon={HiOutlineCalendar}
              color="amber"
              label="Tanggal Daftar"
              value={new Date(user?.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            />
          </div>

          <div className="flex justify-end mt-4 sm:mt-6">
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                gradientDuoTone="cyanToBlue"
                size="sm"
                onClick={onPasswordChange}
                className="font-medium"
              >
                <HiOutlineKey className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Ubah Password
              </Button>
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
