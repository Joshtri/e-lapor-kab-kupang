'use client';

import { Table, Badge, Button, Tooltip } from 'flowbite-react';
import Link from 'next/link';
import { HiEye, HiPencil, HiTrash } from 'react-icons/hi';

export default function OPDTable({ opdList, onShow, onEdit, onDelete }) {
  return (
    <Table striped>
      <Table.Head>
        <Table.HeadCell>Nama OPD</Table.HeadCell>
        <Table.HeadCell>Wilayah</Table.HeadCell>
        <Table.HeadCell>Email</Table.HeadCell>
        <Table.HeadCell>Staff OPD</Table.HeadCell>
        <Table.HeadCell>Aksi</Table.HeadCell>
      </Table.Head>
      <Table.Body>
        {opdList.map((opd) => (
          <Table.Row key={opd.id}>
            <Table.Cell>{opd.name}</Table.Cell> {/* dari OPD.name */}
            <Table.Cell>{opd.wilayah ?? '-'}</Table.Cell> {/* masih dummy */}
            <Table.Cell>{opd.email ?? '-'}</Table.Cell>
            <Table.Cell>
              <Badge color="blue">{opd.staff?.name ?? '-'}</Badge>
            </Table.Cell>
            <Table.Cell>
              <div className="flex items-center gap-2">
                {/* 👁️ Detail - biru */}

                <Link href={`/adm/org-perangkat-daerah/${opd.id}`}>
                  <Tooltip content="Lihat Detail">
                    <Button
                      size="xs"
                      color="gray"
                      className="p-2"
                      onClick={() => onShow?.(opd)}
                    >
                      <HiEye className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                </Link>

                {/* ✏️ Edit - kuning */}
                <Tooltip content="Edit OPD">
                  <Button
                    size="xs"
                    color="yellow"
                    className="p-2"
                    onClick={() => onEdit?.(opd)}
                  >
                    <HiPencil className="w-4 h-4" />
                  </Button>
                </Tooltip>

                {/* 🗑️ Hapus - merah */}
                <Tooltip content="Hapus OPD">
                  <Button
                    size="xs"
                    color="failure"
                    className="p-2"
                    onClick={() => onDelete?.(opd)}
                  >
                    <HiTrash className="w-4 h-4" />
                  </Button>
                </Tooltip>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
