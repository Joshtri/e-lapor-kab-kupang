"use client";

import { Card, Badge, Button } from "flowbite-react";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi";

export default function OPDGrid({ opdList, onShow, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {opdList.map((opd) => (
        <Card key={opd.id} className="p-4 shadow-md space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {opd.name}
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Wilayah: {opd.wilayah ?? "-"}
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Email Instansi: {opd.email ?? "-"}
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Staff:
            <Badge color="blue" className="ml-2">
              {opd.staff?.name ?? "-"}
            </Badge>
          </p>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button size="xs" color="gray" onClick={() => onShow?.(opd)}>
              <HiEye className="mr-1 h-4 w-4" />
            </Button>
            <Button size="xs" color="blue" onClick={() => onEdit?.(opd)}>
              <HiPencil className="mr-1 h-4 w-4" />
            </Button>
            <Button size="xs" color="failure" onClick={() => onDelete?.(opd)}>
              <HiTrash className="mr-1 h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
