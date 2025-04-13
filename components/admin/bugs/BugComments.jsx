'use client';

import { useState, useEffect, useRef } from 'react';
import { Button, Card, Spinner, Textarea, Avatar } from 'flowbite-react';
import { HiOutlineChat, HiOutlinePaperAirplane } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import axios from 'axios';
import { formatDate } from '@/utils/formatDate';

export default function BugComments({ bugId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const commentsEndRef = useRef(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/bugs/${bugId}/comments`);
      setComments(data);
    } catch (error) {
      toast.error('Gagal memuat komentar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [bugId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return toast.error('Komentar tidak boleh kosong');

    try {
      setSubmitting(true);
      const { data } = await axios.post(`/api/bugs/${bugId}/comments`, {
        message: newComment,
      });
      setComments((prev) => [...prev, data]);
      setNewComment('');
      toast.success('Komentar berhasil dikirim');
    } catch (error) {
      toast.error('Gagal mengirim komentar');
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
            <HiOutlineChat className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Komentar
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {comments.length} komentar untuk laporan bug ini
            </p>
          </div>
        </div>

        {/* Daftar Komentar */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto mb-6 p-2">
          {loading ? (
            <div className="flex justify-center p-4">
              <Spinner size="md" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                Belum ada komentar untuk laporan bug ini.
              </p>
            </div>
          ) : (
            comments.map((comment) => {
              const dateInfo = formatDate(comment.createdAt);
              const isAdmin =
                comment.user?.role === 'ADMIN' ||
                comment.user?.role === 'BUPATI';

              return (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg ${
                    isAdmin
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                      : 'bg-gray-50 dark:bg-gray-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar
                      rounded
                      size="md"
                      img={null}
                      placeholderInitials={comment.user?.name?.charAt(0) || 'U'}
                      color={isAdmin ? 'blue' : 'gray'}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {comment.user?.name || 'Unknown'}
                        {isAdmin && (
                          <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            {comment.user?.role}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {dateInfo.formatted} ({dateInfo.relative})
                      </p>
                      <div className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {comment.message}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
          <div ref={commentsEndRef} />
        </div>

        {/* Form Komentar */}
        <Card>
          <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white mb-2">
            Tambahkan Komentar
          </h5>
          <form onSubmit={handleSubmitComment}>
            <div className="mb-4">
              <Textarea
                placeholder="Tulis komentar Anda di sini..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
                rows={4}
                className="resize-none"
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                color="blue"
                disabled={submitting || !newComment.trim()}
                isProcessing={submitting}
              >
                {submitting ? (
                  'Mengirim...'
                ) : (
                  <>
                    <HiOutlinePaperAirplane className="mr-2 h-5 w-5" />
                    Kirim Komentar
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
