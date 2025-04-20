'use client';

import React, { useEffect, useState } from 'react';
import {
  Modal,
  Textarea,
  Button,
  Spinner,
  Avatar,
  Badge,
} from 'flowbite-react';
import axios from 'axios';
import { toast } from 'sonner';
import {
  HiMail,
  HiOutlineMail,
  HiPaperAirplane,
  HiUser,
  HiOfficeBuilding,
  HiClock,
  HiOutlineMailOpen,
  HiShieldCheck,
  HiChatAlt2,
} from 'react-icons/hi';

const CommentModal = ({ open, setOpen, reportId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [userId, setUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isBupati, setIsBupati] = useState(false);

  useEffect(() => {
    if (open) {
      fetchUser();
      fetchComments();
    }
  }, [open, reportId]);

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      setUserId(res.data.user.id);
      setCurrentUser(res.data.user);
      setIsBupati(res.data.user.role === 'BUPATI');
    } catch (error) {
      'Gagal mengambil user:', error;
      toast.error('Gagal mengambil informasi user.');
    }
  };

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/reports/${reportId}/comments`);
      setComments(res.data);
    } catch (error) {
      'Gagal mengambil komentar:', error;
      toast.error('Gagal mengambil komentar.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!userId) {
      toast.error('User tidak ditemukan.');
      return;
    }

    try {
      await axios.post(`/api/reports/${reportId}/comments`, {
        userId,
        comment: newComment,
      });
      toast.success('Komentar ditambahkan!');
      setNewComment('');
      fetchComments();
    } catch (error) {
      'Gagal menambahkan komentar:', error;
      toast.error('Gagal menambahkan komentar.');
    }
  };

  // Helper function to get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'BUPATI':
        return 'success';
      case 'ADMIN':
        return 'purple';
      case 'OPD':
        return 'info';
      case 'PELAPOR':
        return 'gray';
      default:
        return 'gray';
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  return (
    <Modal show={open} onClose={() => setOpen(false)} size="xl">
      <Modal.Header className="border-b-4 border-blue-500">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-2 rounded-full">
            <HiMail className="text-blue-600 h-5 w-5" />
          </div>
          <span className="text-xl font-semibold">Komentar Laporan</span>
        </div>
      </Modal.Header>

      <Modal.Body className="p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Spinner size="xl" />
            <p className="mt-4 text-gray-500">Memuat komentar...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <HiOutlineMailOpen className="h-12 w-12 text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Belum ada komentar.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Jadilah yang pertama memberikan komentar pada laporan ini.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {comments.map((comment) => {
              const formattedDate = formatDate(comment.createdAt);
              const isBupatiComment = comment.user.role === 'BUPATI';
              const isOpdComment = comment.user.role === 'OPD';

              return (
                <div
                  key={comment.id}
                  className={`border-l-4 rounded-lg shadow-sm overflow-hidden ${
                    isBupatiComment
                      ? 'border-green-500 bg-green-50'
                      : isOpdComment
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <Avatar
                          rounded
                          size="md"
                          className="mr-3 "
                          style={{
                            borderColor: isBupatiComment
                              ? 'var(--flowbite-success-200)'
                              : isOpdComment
                                ? 'var(--flowbite-info-200)'
                                : 'var(--flowbite-gray-200)',
                          }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {comment.user.name}
                            </span>
                            <Badge
                              color={getRoleBadgeColor(comment.user.role)}
                              size="sm"
                            >
                              {/* Render role icon and text separately */}
                              <div className="flex items-center">
                                {comment.user.role === 'BUPATI' && (
                                  <HiShieldCheck className="mr-1 h-3 w-3" />
                                )}
                                {comment.user.role === 'ADMIN' && (
                                  <HiUser className="mr-1 h-3 w-3" />
                                )}
                                {comment.user.role === 'OPD' && (
                                  <HiOfficeBuilding className="mr-1 h-3 w-3" />
                                )}
                                {comment.user.role === 'PELAPOR' && (
                                  <HiChatAlt2 className="mr-1 h-3 w-3" />
                                )}
                                {comment.user.role}
                              </div>
                            </Badge>
                          </div>

                          {comment.user.opd && (
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <HiOfficeBuilding className="mr-1 h-3 w-3" />
                              <span>{comment.user.opd.name}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <div className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-500 flex items-center">
                          <HiClock className="mr-1 h-3 w-3" />
                          {formattedDate.date}
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          {formattedDate.time}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded-lg ${
                        isBupatiComment
                          ? 'bg-white border border-green-100'
                          : isOpdComment
                            ? 'bg-white border border-blue-100'
                            : 'bg-white border border-gray-100'
                      }`}
                    >
                      <p className="whitespace-pre-line">{comment.comment}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Comment Form - Styled like a mail compose area */}
        {isBupati ? (
          <div className="mt-6 border-t pt-4">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-2 rounded-full mr-2">
                  <HiOutlineMail className="text-blue-600 h-5 w-5" />
                </div>
                <h3 className="font-medium text-blue-800">
                  Tambahkan Komentar Bupati
                </h3>
              </div>

              <Textarea
                placeholder="Tulis komentar resmi sebagai Bupati..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                className="mb-3"
              />

              <div className="flex justify-end">
                <Button
                  color="blue"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  <HiPaperAirplane className="mr-2 h-4 w-4" />
                  Kirim Komentar
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 border-t pt-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center">
              <div className="bg-gray-200 p-2 rounded-full mr-3">
                <HiShieldCheck className="text-gray-500 h-5 w-5" />
              </div>
              <p className="text-gray-600">
                Hanya Bupati yang dapat memberikan komentar resmi pada laporan
                ini.
              </p>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default CommentModal;
