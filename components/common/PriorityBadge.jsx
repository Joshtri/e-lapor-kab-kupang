const { Badge } = require("flowbite-react");
const { HiOutlineExclamation } = require("react-icons/hi");

const PriorityBadge = ({ priority }) => {
  let color = 'gray';
  let icon = <HiOutlineExclamation className="mr-1" />;
  switch (priority?.toUpperCase()) {
    case 'HIGH':
      color = 'red';
      break;
    case 'MEDIUM':
      color = 'yellow';
      break;
    case 'LOW':
      color = 'green';
      break;
  }
  return (
    <Badge color={color} className="flex items-center w-fit">
      {icon}
      {priority}
    </Badge>
  );
};


export default PriorityBadge;