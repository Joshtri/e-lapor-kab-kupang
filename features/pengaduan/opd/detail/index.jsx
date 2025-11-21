'use client';

import { Badge, Button, Card, HR, Modal } from 'flowbite-react';
import {
  HiOutlineClipboardList,
  HiOutlineOfficeBuilding,
} from 'react-icons/hi';
import { MdPerson4 } from 'react-icons/md';

export default function PengaduanDetailOPD({ report, isOpen, onClose }) {
  const stepColor = (status) =>
    status === 'SELESAI'
      ? 'green'
      : status === 'PROSES'
        ? 'yellow'
        : status === 'DITOLAK'
          ? 'red'
          : 'gray';

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <Modal.Header className="flex items-center gap-2">
        <HiOutlineClipboardList className="text-blue-600 h-5 w-5" />
        <span className="text-xl font-semibold">Detail Laporan</span>
      </Modal.Header>
      <Modal.Body className="space-y-6">
        <Card>
          <h2 className="text-2xl font-bold">{report.title}</h2>
          <p className="text-gray-500">
            Pelapor: <span className="font-medium">{report.user.name}</span>
          </p>
          <p className="mt-4">{report.description}</p>
        </Card>

        <HR />

        {/* Progress Steps */}
        <div className="flex justify-around items-center space-x-4">
          {[
            {
              label: 'OPD Terkait',
              icon: <HiOutlineOfficeBuilding />,
              status: report.opdStatus,
            },
            {
              label: 'Bupati',
              icon: <MdPerson4 />,
              status: report.bupatiStatus,
            },
          ].map((step) => (
            <div key={step.label} className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full bg-${stepColor(step.status)}-100 text-${stepColor(step.status)}-700`}
              >
                {step.icon}
              </div>
              <p className="mt-2 text-sm font-semibold text-center">
                {step.label}
              </p>
              <Badge color={stepColor(step.status)} size="sm" className="mt-1">
                {step.status}
              </Badge>
            </div>
          ))}
        </div>

        <HR />

        <div className="space-y-2">
          <p>
            <strong>OPD yang dituju:</strong> {report.opd?.name ?? '-'}
          </p>
          {report.opd?.email && <p>Email: {report.opd.email}</p>}
          {report.opd?.telp && <p>Telepon: {report.opd.telp}</p>}
        </div>

        <p className="text-sm text-gray-500">
          Diajukan pada: {new Date(report.createdAt).toLocaleString('id-ID')}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray" onClick={onClose}>
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
