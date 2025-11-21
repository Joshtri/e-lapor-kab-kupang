'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Spinner } from 'flowbite-react';
import { HiOutlineChatAlt2, HiOutlineUser } from 'react-icons/hi';

export default function PengaduanComments({ reportId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reportId) {
      fetchComments();
    }
  }, [reportId]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/comments?reportId=${reportId}`);
      // Filter to show all comments (can be filtered by role if needed)
      const allComments = Array.isArray(res.data) ? res.data : [];
      setComments(allComments);
    } catch (error) {
      console.error('Gagal mengambil komentar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <HiOutlineChatAlt2 className="w-6 h-6" />
        Komentar
      </h3>

      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <Spinner size="lg" />
          <span className="ml-2 text-gray-600 dark:text-gray-300">
            Memuat komentar...
          </span>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Belum ada komentar.
        </p>
      ) : (
        <div className="space-y-4 mt-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900"
            >
              <div className="flex items-center gap-2 mb-2">
                <HiOutlineUser className="w-5 h-5 text-gray-500" />
                <div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {comment.user?.name || 'Pengguna'}
                  </span>
                  {comment.user?.role && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {comment.user.role}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {comment.comment}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(comment.createdAt).toLocaleString('id-ID')}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
