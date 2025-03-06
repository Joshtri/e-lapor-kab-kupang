"use client";

import { Table, Badge } from "flowbite-react";

export default function RiwayatTable({ riwayat }) {
  return (
    <Table striped>
      <Table.Head>
        <Table.HeadCell>Subjek Laporan</Table.HeadCell>
        <Table.HeadCell>Kategori</Table.HeadCell>
        <Table.HeadCell>Status</Table.HeadCell>
        <Table.HeadCell>Prioritas</Table.HeadCell>
        <Table.HeadCell>Tanggal</Table.HeadCell>
      </Table.Head>
      <Table.Body>
        {riwayat.map((item) => (
          <Table.Row key={item.id}>
            <Table.Cell>{item.title}</Table.Cell>
            <Table.Cell>{item.category}</Table.Cell>
            <Table.Cell>
              <Badge color={
                item.status === "SELESAI"
                  ? "green"
                  : item.status === "PROSES"
                  ? "yellow"
                  : item.status === "DITOLAK"
                  ? "red"
                  : "gray"
              }>
                {item.status}
              </Badge>
            </Table.Cell>
            <Table.Cell>{item.priority}</Table.Cell>
            <Table.Cell>{new Date(item.createdAt).toLocaleDateString()}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
