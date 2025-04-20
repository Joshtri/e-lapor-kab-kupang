export const getRoleColor = (role) => {
    switch (role) {
      case 'OPD':
        return 'purple';
      case 'ADMIN':
        return 'red';
      default:
        return 'blue';
    }
  };