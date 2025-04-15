export const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'SELESAI':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'DITOLAK':
        return 'failure';
      case 'PROSES':
        return 'info';
      default:
        return 'gray';
    }
  };
  