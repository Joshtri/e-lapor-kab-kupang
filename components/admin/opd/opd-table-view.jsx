"use client";

import { Table, Badge, Button } from "flowbite-react";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi";

export default function OPDTable({ opdList, onShow, onEdit, onDelete }) {
  return (
    <Table striped>
      <Table.Head>
        <Table.HeadCell>Nama OPD</Table.HeadCell>
        <Table.HeadCell>Wilayah</Table.HeadCell>
        <Table.HeadCell>Email</Table.HeadCell>
        <Table.HeadCell>Kepala OPD</Table.HeadCell>
        <Table.HeadCell>Aksi</Table.HeadCell>
      </Table.Head>
      <Table.Body>
        {opdList.map((opd) => (
          <Table.Row key={opd.id}>
            <Table.Cell>{opd.name}</Table.Cell>
            <Table.Cell>{opd.wilayah}</Table.Cell>
            <Table.Cell>{opd.email}</Table.Cell>
            <Table.Cell>
              <Badge color="blue">{opd.kepalaOpdName}</Badge>
            </Table.Cell>
            <Table.Cell>
              <div className="flex gap-2">
                <Button color="gray" size="xs" onClick={() => onShow(opd)}>
                  <HiEye className="mr-1" />
                  Detail
                </Button>
                <Button color="blue" size="xs" onClick={() => onEdit(opd)}>
                  <HiPencil className="mr-1" />
                  Edit
                </Button>
                <Button color="failure" size="xs" onClick={() => onDelete(opd)}>
                  <HiTrash className="mr-1" />
                  Hapus
                </Button>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
