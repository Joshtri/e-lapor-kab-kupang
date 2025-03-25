"use client";

import { Table, Badge } from "flowbite-react";

export default function RiwayatTable({ riwayat }) {
  return (
    <Table striped>
      <Table.Head>
        <Table.HeadCell>Nama Pelapor</Table.HeadCell>
        <Table.HeadCell>Subjek Laporan</Table.HeadCell>
        <Table.HeadCell>OPD Dituju</Table.HeadCell>
        <Table.HeadCell>Kategori</Table.HeadCell>
        <Table.HeadCell>Bupati Status</Table.HeadCell>
        <Table.HeadCell>OPD Status</Table.HeadCell>
        <Table.HeadCell>Prioritas</Table.HeadCell>
        <Table.HeadCell>Tanggal</Table.HeadCell>
      </Table.Head>
      <Table.Body>
        {riwayat.map((item) => (
          <Table.Row key={item.id}>
            <Table.Cell>{item.user.name}</Table.Cell>
            <Table.Cell>{item.title}</Table.Cell>
            <Table.Cell>{item.opd.name}</Table.Cell>
            <Table.Cell>{item.category}</Table.Cell>
            <Table.Cell>
              <Badge
                color={
                  item.bupatiStatus === "SELESAI"
                    ? "green"
                    : item.bupatiStatus === "PROSES"
                      ? "yellow"
                      : item.bupatiStatus === "DITOLAK"
                        ? "red"
                        : "gray"
                }
              >
                {item.bupatiStatus}
              </Badge>
            </Table.Cell>

            <Table.Cell>
              <Badge
                color={
                  item.opdStatus === "SELESAI"
                    ? "green"
                    : item.opdStatus === "PROSES"
                      ? "yellow"
                      : item.opdStatus === "DITOLAK"
                        ? "red"
                        : "gray"
                }
              >
                {item.opdStatus}
              </Badge>
            </Table.Cell>
            <Table.Cell>{item.priority}</Table.Cell>
            <Table.Cell>
              {new Date(item.createdAt).toLocaleDateString()}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
