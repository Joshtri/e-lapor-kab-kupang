'use client';

import { Modal, Table, Badge, Button } from 'flowbite-react';
import { useQuery } from '@tanstack/react-query';
import { HiX, HiUsers } from 'react-icons/hi';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

const fetchOpdStaff = async (opdId) => {
  const response = await fetch(`/api/opd-v2/${opdId}/staff`);
  if (!response.ok) {
    throw new Error('Failed to fetch staff');
  }
  return response.json();
};

export default function StaffOpdModal({ isOpen, onClose, opd }) {
  const {
    data: staff = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['opd-staff', opd?.id],
    queryFn: () => fetchOpdStaff(opd?.id),
    enabled: isOpen && !!opd?.id, // Hanya fetch jika modal terbuka dan ada opdId
  });

  return (
    <Modal show={isOpen} onClose={onClose} size="4xl">
      <Modal.Header>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <HiUsers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Daftar Staff OPD
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {opd?.name || 'Loading...'}
            </p>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">
              Gagal memuat data staff
            </p>
          </div>
        ) : staff.length === 0 ? (
          <div className="text-center py-12">
            <HiUsers className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Belum ada staff di OPD ini
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>No</Table.HeadCell>
                <Table.HeadCell>Nama</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>No. Telepon</Table.HeadCell>
                <Table.HeadCell>Bergabung</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {staff.map((staffMember, index) => (
                  <Table.Row
                    key={staffMember.id}
                    className="bg-white dark:bg-gray-800"
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {index + 1}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {staffMember.name}
                    </Table.Cell>
                    <Table.Cell>{staffMember.email}</Table.Cell>
                    <Table.Cell>
                      {staffMember.contactNumber || (
                        <span className="text-gray-400">-</span>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {format(
                        new Date(staffMember.createdAt),
                        'dd MMM yyyy',
                        {
                          locale: localeId,
                        }
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}

        {/* Summary */}
        {!isLoading && !error && staff.length > 0 && (
          <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Total Staff:{' '}
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                {staff.length}
              </span>
            </p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray" onClick={onClose}>
          <HiX className="w-4 h-4 mr-2" />
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
