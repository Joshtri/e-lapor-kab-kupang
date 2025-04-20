'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Badge, Spinner } from 'flowbite-react';
import { HiOutlineClock, HiOutlineExclamationCircle } from 'react-icons/hi';

const ListReport = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(
          `/api/reports?status=pending&userId=${user.id}`,
        );
        setReports(res.data);
      } catch (error) {
        // ("Gagal mengambil data laporan", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchReports();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <Spinner size="lg" />
        <span className="ml-2 text-gray-600 dark:text-gray-300">
          Memuat laporan...
        </span>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* <Breadcrumbs/> */}

      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Laporan yang Sedang Diajukan
      </h2>

      {reports.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 mt-4">
          Tidak ada laporan yang sedang diajukan.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-4">
          {reports.map((report) => (
            <Card
              key={report.id}
              className="p-5 shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {report.title}
                </h3>
                <Badge color="yellow">
                  <HiOutlineClock className="inline-block mr-1 text-lg" />
                  {report.bupatiStatus}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {report.description.substring(0, 100)}...
              </p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(report.createdAt).toLocaleDateString('id-ID')}
                </span>
                <Badge
                  color={
                    report.priority === 'high'
                      ? 'red'
                      : report.priority === 'normal'
                        ? 'blue'
                        : 'green'
                  }
                >
                  <HiOutlineExclamationCircle className="inline-block mr-1" />
                  {report.priority.toUpperCase()}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListReport;
