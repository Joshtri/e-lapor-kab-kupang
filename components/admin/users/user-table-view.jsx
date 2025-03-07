"use client";

import { Table, Badge, Button } from "flowbite-react";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi";

export default function UserTable({ users }) {
  return (
    <Table striped>
      <Table.Head>
        <Table.HeadCell>Nama</Table.HeadCell>
        <Table.HeadCell>Email</Table.HeadCell>
        <Table.HeadCell>Role</Table.HeadCell>
        <Table.HeadCell>Aksi</Table.HeadCell>
      </Table.Head>
      <Table.Body>
        {users.map((user) => (
          <Table.Row key={user.id}>
            <Table.Cell>{user.name}</Table.Cell>
            <Table.Cell>{user.email}</Table.Cell>
            <Table.Cell>
              <Badge
                color={
                  user.role === "ADMIN"
                    ? "purple"
                    : user.role === "BUPATI"
                      ? "green"
                      : "blue"
                }
              >
                {user.role}
              </Badge>
            </Table.Cell>
            <Table.Cell>
              <div className="flex gap-2">
                {/* Button Show (semua role) */}
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
        ))}
      </Table.Body>
    </Table>
  );
}
