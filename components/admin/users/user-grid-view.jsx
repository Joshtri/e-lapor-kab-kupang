"use client";

import { Card, Avatar, Badge, Button } from "flowbite-react";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi";

export default function UserGrid({ users, onShow, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <Card key={user.id} className="p-4 shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <Avatar rounded />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {user.name}
              </h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <Badge
                color={
                  user.role === "ADMIN"
                    ? "purple"
                    : user.role === "BUPATI"
                    ? "green"
                    : "blue"
                }
                className="mt-1"
              >
                {user.role}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-2">
            {/* Show Button (Boleh untuk semua role) */}
            <Button size="xs" color="gray" onClick={() => onShow(user)}>
              <HiEye className="mr-1 h-4 w-4" />  
            </Button>

            {/* Edit Button (Hanya untuk PELAPOR) */}
            {user.role === "PELAPOR" && (
              <Button size="xs" color="blue" onClick={() => onEdit(user)}>
                <HiPencil className="mr-1 h-4 w-4" />  
              </Button>
            )}

            {/* Delete Button (Hanya untuk PELAPOR) */}
            {user.role === "PELAPOR" && (
              <Button
                size="xs"
                color="failure"
                onClick={() => onDelete(user)}
              >
                <HiTrash className="mr-1 h-4 w-4" />  
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
