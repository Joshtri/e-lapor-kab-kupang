export const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    // Status laporan umum
    case 'SELESAI':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'DITOLAK':
      return 'failure';
    case 'PROSES':
      return 'info';

    // Status Bug
    case 'OPEN':
      return 'failure'; // atau 'red'
    case 'IN_PROGRESS':
      return 'warning'; // atau 'yellow'
    case 'RESOLVED':
      return 'success'; // atau 'green'

    // Prioritas Bug
    case 'LOW':
      return 'blue';
    case 'MEDIUM':
      return 'warning'; // atau 'yellow'
    case 'HIGH':
      return 'failure'; // atau 'red'

    default:
      return 'gray';
  }
};
