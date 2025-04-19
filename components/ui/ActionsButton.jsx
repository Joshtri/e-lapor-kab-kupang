import { Button, Tooltip } from 'flowbite-react';
import Link from 'next/link';

const ActionsButton = ({
  icon: Icon,
  tooltip,
  color = 'gray',
  href = null,
  onClick = null,
  disabled = false,
  className = '',
}) => {
  const button = (
    <Button
      size="xs"
      color={color}
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 hover:opacity-90 ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />} {/* ✅ render icon sebagai children */}
    </Button>
  );

  return (
    <Tooltip content={tooltip} placement="top">
      {href ? <Link href={href}>{button}</Link> : button}
    </Tooltip>
  );
};

export default ActionsButton;
