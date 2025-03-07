"use client";

import { Table, Badge } from "flowbite-react";

export default function ReportTable({ reports }) {
  return (
    <Table striped>
      <Table.Head>
        <Table.HeadCell>Judul</Table.HeadCell>
        <Table.HeadCell>Kategori</Table.HeadCell>
        <Table.HeadCell>Status</Table.HeadCell>
        <Table.HeadCell>Prioritas</Table.HeadCell>
        <Table.HeadCell>Tanggal</Table.HeadCell>
      </Table.Head>
      <Table.Body>
        {reports.map((report) => (
          <Table.Row key={report.id}>
            <Table.Cell>{report.title}</Table.Cell>
            <Table.Cell>{report.category}</Table.Cell>
            <Table.Cell>
              <Badge
                color={
                  report.status === "SELESAI"
                    ? "green"
                    : report.status === "PROSES"
                      ? "yellow"
                      : report.status === "DITOLAK"
                        ? "red"
                        : "gray"
                }
              >
                {report.status}
              </Badge>
            </Table.Cell>
            <Table.Cell>{report.priority}</Table.Cell>
            <Table.Cell>
              {new Date(report.createdAt).toLocaleDateString()}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
