'use client';

import React, { useEffect, useState } from 'react';
import { Modal, Textarea, Button, Spinner } from 'flowbite-react';
import axios from 'axios';
import { toast } from 'sonner';

const CommentModal = ({ open, setOpen, reportId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [userId, setUserId] = useState(null); // ID user yang login
  const [isBupati, setIsBupati] = useState(false); // Pastikan hanya Bupati yang bisa komentar

  useEffect(() => {
    if (open) {
      fetchUser();
      fetchComments();
    }
  }, [open]);

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      res;
      setUserId(res.data.user.id);
      setIsBupati(res.data.user.role === 'BUPATI'); // Pastikan user adalah Bupati
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
        userId, // Gunakan userId dari API /auth/me
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

  return (
    <Modal show={open} onClose={() => setOpen(false)} size="lg">
      <Modal.Header>Komentar Laporan</Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            Belum ada komentar.
          </p>
        ) : (
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="p-3 bg-gray-100 dark:bg-gray-700 rounded"
              >
                <p className="text-sm font-medium">{comment.user.name}</p>
                <p className="text-gray-700 dark:text-gray-300">
                  {comment.comment}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Form komentar hanya tampil jika user adalah Bupati */}
        {isBupati && (
          <div className="mt-4">
            <Textarea
              placeholder="Tulis komentar..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <Button className="mt-2" onClick={handleAddComment}>
              Kirim Komentar
            </Button>
          </div>
        )}

        {!isBupati && (
          <p className="text-red-500 text-sm mt-4">
            Hanya Bupati yang dapat memberikan komentar pada laporan ini.
          </p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default CommentModal;
