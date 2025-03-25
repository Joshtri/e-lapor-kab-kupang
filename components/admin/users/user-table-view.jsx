"use client";

import { Table, Badge, Button } from "flowbite-react";
import { HiEye, HiPencil, HiTrash, HiExclamationCircle, HiOfficeBuilding } from "react-icons/hi";

export default function UserTable({ users, incompleteProfiles = [] }) {
  return (
    <Table striped>
      <Table.Head>
        <Table.HeadCell>Nama</Table.HeadCell>
        <Table.HeadCell>Email</Table.HeadCell>
        <Table.HeadCell>Role</Table.HeadCell>
        <Table.HeadCell>Aksi</Table.HeadCell>
      </Table.Head>
      <Table.Body>
        {users.map((user) => {
          const isOPDWithoutProfile =
            user.role === "OPD" && incompleteProfiles.includes(user.id);

          return (
            <Table.Row
              key={user.id}
              className={isOPDWithoutProfile ? "bg-red-100 dark:bg-red-900" : ""}
            >
              <Table.Cell>
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>

                  {/* Nama instansi OPD jika ada */}
                  {user.role === "OPD" && user.opd?.name && (
                    <span className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-1">
                      <HiOfficeBuilding className="inline h-4 w-4" />
                      <span>{user.opd.name}</span>
                    </span>
                  )}

                  {/* Warning jika belum punya profil OPD */}
                  {isOPDWithoutProfile && (
                    <span className="text-xs text-red-600 dark:text-red-300 flex items-center gap-1">
                      <HiExclamationCircle className="inline h-4 w-4" />
                      Profil instansi OPD belum lengkap
                    </span>
                  )}
                </div>
              </Table.Cell>

              <Table.Cell>{user.email}</Table.Cell>

              <Table.Cell>
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
                >
                  {user.role}
                </Badge>
              </Table.Cell>

              <Table.Cell>
                <div className="flex gap-2">
                  <Button color="gray" size="xs">
                    <HiEye className="mr-1" />
                    Show
                  </Button>

                  {/* Edit & Delete hanya untuk PELAPOR */}
                  {user.role === "PELAPOR" && (
                    <>
                      <Button color="yellow" size="xs">
                        <HiPencil className="mr-1" />
                        Edit
                      </Button>
                      <Button color="failure" size="xs">
                        <HiTrash className="mr-1" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}
