import { Badge } from 'flowbite-react';

// const getStatusColor = (status) => {
//   switch (status) {
//     case 'SELESAI':
//       return 'green';
//     case 'PROSES':
//       return 'yellow';
//     case 'DITOLAK':
//       return 'red';
//     default:
//       return 'gray';
//   }
// };

const StatusBadge = ({ bupati = '-', opd = '-' }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'SELESAI': return 'green';
        case 'PROSES': return 'yellow';
        case 'DITOLAK': return 'red';
        default: return 'gray';
      }
    };
  
    return (
      <div className="flex flex-col gap-1">
        <Badge color={getStatusColor(bupati)} className="w-fit text-xs">
          Bupati: {bupati || '-'}
        </Badge>
        <Badge color={getStatusColor(opd)} className="w-fit text-xs">
          OPD: {opd || '-'}
        </Badge>
      </div>
    );
  };
  


export default StatusBadge;
