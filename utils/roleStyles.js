export function getRoleStyles(role) {
  const styles = {
    ADMIN: {
      badgeColor: 'purple',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
    BUPATI: {
      badgeColor: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900',
      textColor: 'text-green-600 dark:text-green-400',
    },
    OPD: {
      badgeColor: 'indigo',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900',
      textColor: 'text-indigo-600 dark:text-indigo-400',
    },
    PELAPOR: {
      badgeColor: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    default: {
      badgeColor: 'gray',
      bgColor: 'bg-gray-100 dark:bg-gray-700',
      textColor: 'text-gray-600 dark:text-gray-400',
    },
  };

  return styles[role] || styles.default;
}
