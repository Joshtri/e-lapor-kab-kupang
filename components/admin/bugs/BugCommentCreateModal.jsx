'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Button,
  Modal,
  Spinner,
  Textarea,
  Avatar,
  Badge,
} from 'flowbite-react';
import { HiOutlineChat, HiOutlinePaperAirplane } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

// Helper
const formatDate = (date) => ({
  formatted: format(new Date(date), 'dd MMM yyyy, HH:mm', { locale: id }),
  relative: formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: id,
  }),
});

const getStatusBadgeColor = (s) =>
  ({ OPEN: 'red', IN_PROGRESS: 'yellow', RESOLVED: 'green' })[s] || 'gray';
const getStatusText = (s) =>
  ({ OPEN: 'Open', IN_PROGRESS: 'In Progress', RESOLVED: 'Resolved' })[s] || s;
const getPriorityBadgeColor = (p) =>
  ({ LOW: 'blue', MEDIUM: 'yellow', HIGH: 'red' })[p] || 'gray';
const getPriorityText = (p) =>
  ({ LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' })[p] || p;

export default function BugCommentCreateModal({
  isOpen,
  onClose,
  bugId,
  currentUser,
}) {
  const [bug, setBug] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const commentsEndRef = useRef(null);

  const fetchData = async () => {
    if (!bugId || !isOpen) return;
    setLoading(true);

    try {
      const [bugRes, commentsRes] = await Promise.all([
        fetch(`/api/bugs/${bugId}`),
        fetch(`/api/bugs/${bugId}/comments`),
      ]);

      if (!bugRes.ok || !commentsRes.ok) throw new Error();
      const bugData = await bugRes.json();
      const commentsData = await commentsRes.json();

      setBug(bugData);
      setComments(commentsData);
    } catch {
      toast.error('Gagal memuat data komentar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [bugId, isOpen]);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [comments, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return toast.error('Komentar tidak boleh kosong');

    try {
      setSubmitting(true);
      const res = await fetch(`/api/bugs/${bugId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newComment }),
      });

      if (!res.ok) throw new Error();
      const newData = await res.json();

      setComments([...comments, newData]);
      setNewComment('');
      toast.success('Komentar berhasil dikirim');
    } catch {
      toast.error('Gagal mengirim komentar');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="xl" popup>
      <Modal.Header className="border-b">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
            <HiOutlineChat className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Komentar Bug Report
            </h3>
            {bug && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {bug.title}
              </p>
            )}
          </div>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          {bug && (
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border">
              <div className="flex gap-2">
                <Badge color={getStatusBadgeColor(bug.statusProblem)}>
                  {getStatusText(bug.statusProblem)}
                </Badge>
                <Badge color={getPriorityBadgeColor(bug.priorityProblem)}>
                  {getPriorityText(bug.priorityProblem)}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {bug.description}
              </p>
            </div>
          )}

          <div className="max-h-[300px] overflow-y-auto p-2 border rounded-lg">
            {loading ? (
              <div className="flex justify-center p-4">
                <Spinner size="md" />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 p-4">
                Belum ada komentar untuk laporan bug ini
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((c) => {
                  const { formatted, relative } = formatDate(c.createdAt);
                  const isAdmin = ['ADMIN', 'BUPATI'].includes(c.user?.role);

                  return (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg ${
                        isAdmin
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                          : 'bg-gray-50 dark:bg-gray-700'
                      }`}
                    >
                      <div className="flex gap-3">
                        <Avatar
                          rounded
                          size="md"
                          img={null}
                          placeholderInitials={c.user?.name?.[0] || 'U'}
                          color={isAdmin ? 'blue' : 'gray'}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {c.user?.name || 'Unknown'}{' '}
                              {isAdmin && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded">
                                  {c.user?.role}
                                </span>
                              )}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatted} ({relative})
                          </p>
                          <div className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-line">
                            {c.message}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={commentsEndRef} />
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <Textarea
              placeholder="Tulis komentar Anda di sini..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="resize-none mb-4"
              required
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                color="blue"
                isProcessing={submitting}
                disabled={submitting || !newComment.trim()}
              >
                <HiOutlinePaperAirplane className="mr-2 h-5 w-5" />
                Kirim Komentar
              </Button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}
