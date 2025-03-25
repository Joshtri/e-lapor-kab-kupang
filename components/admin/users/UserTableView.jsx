'use client';

import { Table, Badge, Button, Tooltip } from 'flowbite-react';
import Link from 'next/link';
import {
  HiEye,
  HiPencil,
  HiTrash,
  HiExclamationCircle,
  HiOfficeBuilding,
} from 'react-icons/hi';
import UserEditModal from './UserEditModal';
import { useState } from 'react';

export default function UserTable({ users, incompleteProfiles = [], onSuccess  }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
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
            user.role === 'OPD' && incompleteProfiles.includes(user.id);

          return (
            <Table.Row
              key={user.id}
              className={
                isOPDWithoutProfile ? 'bg-red-100 dark:bg-red-900' : ''
              }
            >
              <Table.Cell>
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>

                  {/* Nama instansi OPD jika ada */}
                  {user.role === 'OPD' && user.opd?.name && (
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
                    user.role === 'ADMIN'
                      ? 'purple'
                      : user.role === 'BUPATI'
                        ? 'green'
                        : user.role === 'OPD'
                          ? 'indigo'
                          : 'blue'
                  }
                >
                  {user.role}
                </Badge>
              </Table.Cell>

              <Table.Cell>
                <div className="flex items-center gap-2">
                  {/* <Tooltip content="Lihat">
                    <Button color="gray" size="xs" className="p-2">
                      <HiEye className="w-4 h-4" />
                    </Button>
                  </Tooltip> */}

                  <Link href={`/adm/users/${user.id}`}>
                    <Tooltip content="Lihat Detail">
                      <Button color="gray" size="xs" className="p-2">
                        <HiEye className="w-4 h-4" />
                      </Button>
                    </Tooltip>
                  </Link>

                  <Tooltip content="Edit">
                    <Button
                      color="yellow"
                      size="xs"
                      className="p-2"
                      onClick={() => {
                        setSelectedUser(user);
                        setOpenEdit(true);
                      }}
                    >
                      <HiPencil className="w-4 h-4" />
                    </Button>
                  </Tooltip>

                  <Tooltip content="Hapus">
                    <Button color="failure" size="xs" className="p-2">
                      <HiTrash className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                </div>
              </Table.Cell>
            </Table.Row>
          );
        })}
        <UserEditModal
          open={openEdit}
          setOpen={setOpenEdit}
          user={selectedUser}
          onSuccess={onSuccess}
          />
      </Table.Body>
    </Table>
  );
}
