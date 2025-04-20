'use client';

import { useEffect, useState } from 'react';
import { Modal, Spinner, Textarea, Button } from 'flowbite-react';
import axios from 'axios';
import { HiChatAlt2 } from 'react-icons/hi';

export default function BugCommentModal({ open, setOpen, bugReportId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      if (!bugReportId || !open) return;
      setLoading(true);
      try {
        const res = await axios.get(
          `/api/pelapor/bug-reports/${bugReportId}/comments`,
        );
        setComments(res.data);
      } catch (err) {
        // ('Gagal mengambil komentar bug:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [bugReportId, open]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const res = await axios.post(
        `/api/pelapor/bug-reports/${bugReportId}/comments`,
        {
          message: newComment,
        },
      );
      setComments((prev) => [res.data, ...prev]);
      setNewComment('');
    } catch (err) {
      // ('Gagal mengirim komentar:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={open} onClose={() => setOpen(false)}>
      <Modal.Header>Komentar Bug</Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-sm text-center">
                  Belum ada komentar.
                </p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded"
                  >
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {comment.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(comment.createdAt).toLocaleString('id-ID')}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="mt-4 space-y-2">
            <Textarea
              placeholder="Tulis komentar baru..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <div className="text-right">
              <Button
                size="sm"
                color="purple"
                onClick={handleSubmit}
                isProcessing={submitting}
                disabled={!newComment.trim()}
              >
                Kirim Komentar
              </Button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
