"use client";

import { Card, Avatar, Badge, Button } from "flowbite-react";
import { HiEye, HiPencil, HiTrash, HiOfficeBuilding } from "react-icons/hi";

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

              {/* 🏢 Nama instansi OPD jika ada */}
              {user.role === "OPD" && user.opd?.name && (
                <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1 mt-1">
                  <HiOfficeBuilding className="h-4 w-4 text-blue-600" />
                  <span>{user.opd.name}</span>
                </div>
              )}

              {/* 🎯 Badge role */}
              <Badge
                color={
                  user.role === "ADMIN"
                    ? "purple"
                    : user.role === "BUPATI"
                    ? "green"
                    : user.role === "OPD"
                    ? "indigo"
                    : "blue"
                }
                className="mt-1"
              >
                {user.role}
              </Badge>
            </div>
          </div>

          {/* 🎛️ Action Buttons */}
          <div className="flex justify-end gap-2 mt-2">
            <Button size="xs" color="gray" onClick={() => onShow(user)}>
              <HiEye className="mr-1 h-4 w-4" />
            </Button>

            {user.role === "ADMIN" && (
              <>
                <Button size="xs" color="blue" onClick={() => onEdit(user)}>
                  <HiPencil className="mr-1 h-4 w-4" />
                </Button>
                <Button size="xs" color="failure" onClick={() => onDelete(user)}>
                  <HiTrash className="mr-1 h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
