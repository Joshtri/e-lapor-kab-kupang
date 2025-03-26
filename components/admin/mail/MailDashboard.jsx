'use client';

import { useState, useEffect } from 'react';
import { Tabs, Button, Spinner } from 'flowbite-react';
import {
  HiOutlineMail,
  HiOutlinePaperAirplane,
  HiOutlineDocumentDuplicate,
  HiOutlineTrash,
  HiOutlinePlus,
} from 'react-icons/hi';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import TabsComponent from '@/components/ui/tabs-group'; // pastikan path-nya sesuai

import ComposeMailList from '@/components/admin/mail/ComposeMailList';
import SentMailList from '@/components/admin/mail/SentMailList';
import DraftMailList from '@/components/admin/mail/DraftMailList';
import TrashMailList from '@/components/admin/mail/TrashMailList';
import ComposeMailModal from '@/components/admin/mail/ComposeMailCreateModal';

export default function MailDashboard() {
  const [activeTab, setActiveTab] = useState('compose');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Gagal mengambil data users:', error);
      toast.error('Gagal mengambil data users.');
    } finally {
      setLoading(false);
    }
  };

  const handleComposeToUser = (user) => {
    setSelectedUser(user);
    setIsComposeOpen(true);
  };

  const handleCloseCompose = () => {
    setIsComposeOpen(false);
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-full mx-auto p-4 space-y-6">
        {/* Header with envelope styling */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-t-4 border-blue-500"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <HiOutlineMail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Pusat Pesan
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Kirim dan kelola pesan laporan Anda
                </p>
              </div>
            </div>

            <Button
              color="blue"
              onClick={() => setIsComposeOpen(true)}
              className="flex items-center gap-2"
            >
              <HiOutlinePlus className="h-5 w-5" />
              Buat Pesan Baru
            </Button>
          </div>
        </motion.div>

        {/* Mail interface with tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <Tabs onActiveTabChange={(tab) => setActiveTab(tab)}>
            <Tabs.Item
              active={activeTab === 'compose'}
              title="Tulis Pesan"
              icon={HiOutlineMail}
            >
              <ComposeMailList
                users={users}
                onComposeToUser={handleComposeToUser}
              />
            </Tabs.Item>
            <Tabs.Item
              active={activeTab === 'sent'}
              title="Terkirim"
              icon={HiOutlinePaperAirplane}
            >
              <SentMailList />
            </Tabs.Item>
            <Tabs.Item
              active={activeTab === 'drafts'}
              title="Draft"
              icon={HiOutlineDocumentDuplicate}
            >
              <DraftMailList />
            </Tabs.Item>
            <Tabs.Item
              active={activeTab === 'trash'}
              title="Sampah"
              icon={HiOutlineTrash}
            >
              <TrashMailList />
            </Tabs.Item>
          </Tabs>
        </div>

        {/* Compose Mail Modal */}
        <ComposeMailModal
          isOpen={isComposeOpen}
          onClose={handleCloseCompose}
          initialRecipient={selectedUser?.email || ''}
          initialSubject=""
        />
      </div>
    </>
  );
}
