'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Spinner,
  TextInput,
  Textarea,
  Select,
  Label,
  Alert,
} from 'flowbite-react';
import {
  HiOutlineUser,
  HiOutlineSearch,
  HiOutlinePlus,
  HiOutlineExclamation,
  HiOutlineCheck,
} from 'react-icons/hi';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { FaBug } from 'react-icons/fa';
import PageHeader from '@/components/ui/PageHeader';
export default function AddBugReport({ currentUser }) {
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [selectedUserId, setSelectedUserId] = useState('');

  // Users data
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Loading states
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);

        const response = await fetch('/api/users');

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        'Error fetching users:', error;
        toast.error('Gagal memuat data pengguna');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.role &&
            user.role.toLowerCase().includes(searchQuery.toLowerCase())),
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!title.trim()) {
      toast.error('Judul bug tidak boleh kosong');
      return;
    }

    if (!description.trim()) {
      toast.error('Deskripsi bug tidak boleh kosong');
      return;
    }

    if (!selectedUserId) {
      toast.error('Pilih pengguna terlebih dahulu');
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch('/api/bugs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: Number.parseInt(selectedUserId),
          title,
          description,
          priorityProblem: priority,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create bug report');
      }

      // Reset form
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setSelectedUserId('');
      setSearchQuery('');

      setSuccess(true);
      toast.success('Laporan bug berhasil dibuat');

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      'Error creating bug report:', error;
      toast.error('Gagal membuat laporan bug');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <PageHeader
        title="Tambah Laporan Bug"
        description="Buat laporan bug baru atas nama pengguna"
        backHref="/adm/bugs"
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-t-4 border-red-500 mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
            <HiOutlinePlus className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Tambah Laporan Bug
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Buat laporan bug baru atas nama pengguna
            </p>
          </div>
        </div>
      </motion.div>

      {success && (
        <Alert color="success" className="mb-6">
          <div className="flex items-center gap-3">
            <HiOutlineCheck className="h-6 w-6" />
            <span className="font-medium">Laporan bug berhasil dibuat!</span>
          </div>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left side - User selection */}
        <div className="md:col-span-1">
          <Card>
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              Pilih Pengguna
            </h5>

            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <HiOutlineSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <TextInput
                  type="text"
                  placeholder="Cari pengguna..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {loadingUsers ? (
              <div className="flex justify-center p-4">
                <Spinner size="md" />
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto border rounded-lg">
                {filteredUsers.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    Tidak ada pengguna yang ditemukan
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          selectedUserId === user.id.toString()
                            ? 'bg-red-50 dark:bg-red-900/20'
                            : ''
                        }`}
                        onClick={() => setSelectedUserId(user.id.toString())}
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                            <HiOutlineUser className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {user.email}
                            </p>
                            {user.role && (
                              <span className="inline-block text-xs font-medium px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 mt-1">
                                {user.role}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedUserId && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Pengguna terpilih:</span>{' '}
                  {users.find((u) => u.id.toString() === selectedUserId)?.name}
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Right side - Bug report form */}
        <div className="md:col-span-2">
          <Card>
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              Detail Laporan Bug
            </h5>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="title" value="Judul Bug" />
                </div>
                <TextInput
                  id="title"
                  placeholder="Masukkan judul bug"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="priority" value="Prioritas" />
                </div>
                <Select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  required
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </Select>
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="description" value="Deskripsi Bug" />
                </div>
                <Textarea
                  id="description"
                  placeholder="Jelaskan detail bug yang ditemukan..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={8}
                  className="resize-none"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-2 mb-4">
                  <div className="bg-yellow-100 dark:bg-yellow-900 p-1 rounded-full mt-0.5">
                    <HiOutlineExclamation className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Pastikan Anda telah memilih pengguna dan mengisi semua
                    detail bug dengan benar sebelum mengirimkan laporan.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    color="red"
                    disabled={submitting || !selectedUserId}
                    isProcessing={submitting}
                  >
                    {submitting ? (
                      'Mengirim...'
                    ) : (
                      <>
                        <FaBug className="mr-2 h-5 w-5" />
                        Buat Laporan Bug
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
