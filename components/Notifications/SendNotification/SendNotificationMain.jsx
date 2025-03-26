'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Checkbox,
  Label,
  Select,
  Spinner,
  TextInput,
  Textarea,
} from 'flowbite-react';
import {
  HiOutlineBell,
  HiOutlineUsers,
  HiOutlineOfficeBuilding,
  HiOutlineUserGroup,
  HiOutlineLink,
  HiOutlinePaperAirplane,
  HiOutlineCheck,
  HiOutlineExclamation,
} from 'react-icons/hi';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function SendNotificationMain() {
  // State for form fields
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [recipientType, setRecipientType] = useState('role'); // 'role', 'specific', 'opd'
  const [selectedRole, setSelectedRole] = useState('PELAPOR');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedOPDs, setSelectedOPDs] = useState([]);
  const [generatedLink, setGeneratedLink] = useState(null);

  // State for data
  const [users, setUsers] = useState([]);
  const [opds, setOPDs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [previewCount, setPreviewCount] = useState(0);

  // Fetch users and OPDs on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch users
        const usersResponse = await fetch('/api/users');
        const usersData = await usersResponse.json();
        setUsers(usersData);

        // Fetch OPDs
        const opdsResponse = await fetch('/api/opd/list');
        const opdsData = await opdsResponse.json();
        setOPDs(opdsData);

        // Set initial preview count
        setPreviewCount(
          usersData.filter((user) => user.role === 'PELAPOR').length,
        );
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Gagal mengambil data pengguna dan OPD');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update preview count when recipient selection changes
  useEffect(() => {
    if (recipientType === 'role') {
      const count = users.filter((user) => user.role === selectedRole).length;
      setPreviewCount(count);
    } else if (recipientType === 'specific') {
      setPreviewCount(selectedUsers.length);
    } else if (recipientType === 'opd') {
      setPreviewCount(selectedOPDs.length);
    }
  }, [recipientType, selectedRole, selectedUsers, selectedOPDs, users]);

  const roleToPathPrefix = {
    ADMIN: 'adm',
    PELAPOR: 'pelapor',
    OPD: 'opd',
    BUPATI: 'bupati-portal',
  };

  // Generate link otomatis setiap kali pilihan berubah
  useEffect(() => {
    let autoLink = null;

    if (recipientType === 'role') {
      const prefix =
        roleToPathPrefix[selectedRole] || selectedRole.toLowerCase();
      autoLink = `/${prefix}/notification-list/[id]`;
    } else if (recipientType === 'specific' && selectedUsers.length > 0) {
      const firstUser = users.find((u) => u.id === selectedUsers[0]);
      if (firstUser) {
        const prefix =
          roleToPathPrefix[firstUser.role] || firstUser.role.toLowerCase();
        autoLink = `/${prefix}/notification-list/[id]`;
      }
    } else if (recipientType === 'opd') {
      autoLink = `/opd/notification-list/[id]`;
    }

    setGeneratedLink(autoLink);
  }, [recipientType, selectedRole, selectedUsers, opds, users]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message) {
      toast.error('Pesan notifikasi tidak boleh kosong');
      return;
    }

    // Validate recipient selection
    if (recipientType === 'specific' && selectedUsers.length === 0) {
      toast.error('Pilih minimal satu pengguna');
      return;
    }

    if (recipientType === 'opd' && selectedOPDs.length === 0) {
      toast.error('Pilih minimal satu OPD');
      return;
    }

    setSending(true);

    try {
      // Prepare notification data
      // ⏬ Generate link otomatis (frontend)
      let generatedLink = null;

      if (recipientType === 'role') {
        const prefix = roleToPathPrefix[selectedRole] || selectedRole.toLowerCase();
        generatedLink = `/${prefix}/notification-list/[id]`;
      } else if (recipientType === 'specific' && selectedUsers.length > 0) {
        const firstUser = users.find((u) => u.id === selectedUsers[0]);
        if (firstUser) {
          const prefix = roleToPathPrefix[firstUser.role] || firstUser.role.toLowerCase();
          generatedLink = `/${prefix}/notification-list/[id]`;
        }
      } else if (recipientType === 'opd') {
        generatedLink = `/opd/notification-list/[id]`;
      }
      

      // ⏬ Kirim ke backend
      const notificationData = {
        message,
        link: generatedLink || null,
        recipientType,
        recipients:
          recipientType === 'role'
            ? { role: selectedRole }
            : recipientType === 'specific'
              ? { userIds: selectedUsers }
              : { opdIds: selectedOPDs },
      };

      // Send notification
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      const result = await response.json();

      toast.success(`Berhasil mengirim ${result.count} notifikasi`);

      // Reset form
      setMessage('');
      setLink('');
      setSelectedUsers([]);
      setSelectedOPDs([]);
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Gagal mengirim notifikasi');
    } finally {
      setSending(false);
    }
  };

  // Toggle user selection
  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  // Toggle OPD selection
  const toggleOPDSelection = (opdId) => {
    setSelectedOPDs((prev) =>
      prev.includes(opdId)
        ? prev.filter((id) => id !== opdId)
        : [...prev, opdId],
    );
  };

  // Select all users of a specific role
  const selectAllUsersOfRole = (role) => {
    const userIds = users
      .filter((user) => user.role === role)
      .map((user) => user.id);

    setSelectedUsers(userIds);
  };

  // Select all OPDs
  const selectAllOPDs = () => {
    const opdIds = opds.map((opd) => opd.id);
    setSelectedOPDs(opdIds);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-t-4 border-blue-500 mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
            <HiOutlineBell className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Kirim Notifikasi
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Kirim notifikasi ke pengguna atau OPD
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left side - Notification form */}
        <div className="md:col-span-2">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="recipientType" value="Jenis Penerima" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    color={recipientType === 'role' ? 'blue' : 'light'}
                    onClick={() => setRecipientType('role')}
                    type="button"
                    className="flex items-center gap-2"
                  >
                    <HiOutlineUserGroup className="h-5 w-5" />
                    Berdasarkan Role
                  </Button>
                  <Button
                    color={recipientType === 'specific' ? 'blue' : 'light'}
                    onClick={() => setRecipientType('specific')}
                    type="button"
                    className="flex items-center gap-2"
                  >
                    <HiOutlineUsers className="h-5 w-5" />
                    Pengguna Spesifik
                  </Button>
                  <Button
                    color={recipientType === 'opd' ? 'blue' : 'light'}
                    onClick={() => setRecipientType('opd')}
                    type="button"
                    className="flex items-center gap-2"
                  >
                    <HiOutlineOfficeBuilding className="h-5 w-5" />
                    OPD
                  </Button>
                </div>
              </div>

              {/* Role-based recipient selection */}
              {recipientType === 'role' && (
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="role" value="Pilih Role" />
                  </div>
                  <Select
                    id="role"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    required
                  >
                    <option value="PELAPOR">PELAPOR</option>
                    <option value="OPD">OPD</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="BUPATI">BUPATI</option>
                  </Select>
                </div>
              )}

              {/* Specific user selection */}
              {recipientType === 'specific' && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label value="Pilih Pengguna" />
                    <div className="flex gap-2">
                      <Button
                        size="xs"
                        color="light"
                        onClick={() => selectAllUsersOfRole('PELAPOR')}
                        type="button"
                      >
                        Semua Pelapor
                      </Button>
                      <Button
                        size="xs"
                        color="light"
                        onClick={() => selectAllUsersOfRole('OPD')}
                        type="button"
                      >
                        Semua OPD
                      </Button>
                      <Button
                        size="xs"
                        color="light"
                        onClick={() => setSelectedUsers([])}
                        type="button"
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto border rounded-lg p-2 bg-gray-50 dark:bg-gray-700">
                    <div className="space-y-2">
                      {users.map((user) => (
                        <div key={user.id} className="flex items-center">
                          <Checkbox
                            id={`user-${user.id}`}
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUserSelection(user.id)}
                          />
                          <Label
                            htmlFor={`user-${user.id}`}
                            className="ml-2 flex flex-col"
                          >
                            <span className="font-medium">{user.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {user.email} - {user.role}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* OPD selection */}
              {recipientType === 'opd' && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label value="Pilih OPD" />
                    <div className="flex gap-2">
                      <Button
                        size="xs"
                        color="light"
                        onClick={selectAllOPDs}
                        type="button"
                      >
                        Pilih Semua
                      </Button>
                      <Button
                        size="xs"
                        color="light"
                        onClick={() => setSelectedOPDs([])}
                        type="button"
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto border rounded-lg p-2 bg-gray-50 dark:bg-gray-700">
                    <div className="space-y-2">
                      {opds.map((opd) => (
                        <div key={opd.id} className="flex items-center">
                          <Checkbox
                            id={`opd-${opd.id}`}
                            checked={selectedOPDs.includes(opd.id)}
                            onChange={() => toggleOPDSelection(opd.id)}
                          />
                          <Label
                            htmlFor={`opd-${opd.id}`}
                            className="ml-2 flex flex-col"
                          >
                            <span className="font-medium">{opd.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {opd.email || 'No email'} -{' '}
                              {opd.telp || 'No phone'}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Message input */}
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="message" value="Pesan Notifikasi" />
                </div>
                <Textarea
                  id="message"
                  placeholder="Tulis pesan notifikasi di sini..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Link input (optional) */}
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="link" value="Link (Opsional)" />
                </div>
                {/* <TextInput
                  id="link"
                  type="url"
                  placeholder="https://example.com/page"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  icon={HiOutlineLink}
                /> */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Link akan ditampilkan sebagai tombol pada notifikasi
                </p>
                {generatedLink && (
                  <div className="mt-2">
                    <Button
                      size="xs"
                      color="light"
                      className="flex items-center gap-1"
                    >
                      <HiOutlineLink className="h-4 w-4" />
                      {generatedLink}
                    </Button>
                  </div>
                )}
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                color="blue"
                className="w-full"
                disabled={sending}
                isProcessing={sending}
              >
                {sending ? (
                  'Mengirim Notifikasi...'
                ) : (
                  <>
                    <HiOutlinePaperAirplane className="mr-2 h-5 w-5" />
                    Kirim Notifikasi
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>

        {/* Right side - Preview and info */}
        <div className="md:col-span-1">
          <Card className="mb-4">
            <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white mb-2">
              Ringkasan Notifikasi
            </h5>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                  <HiOutlineUsers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Penerima:
                  </p>
                  <p className="font-medium">
                    {recipientType === 'role' &&
                      `Semua pengguna dengan role ${selectedRole}`}
                    {recipientType === 'specific' &&
                      `${selectedUsers.length} pengguna terpilih`}
                    {recipientType === 'opd' &&
                      `${selectedOPDs.length} OPD terpilih`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                  <HiOutlineBell className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Jumlah Notifikasi:
                  </p>
                  <p className="font-medium">
                    {previewCount} notifikasi akan dikirim
                  </p>
                </div>
              </div>

              {message && (
                <div className="border-t pt-3 mt-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Preview Pesan:
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-gray-900 dark:text-white">{message}</p>
                    {link && (
                      <div className="mt-2">
                        <Button
                          size="xs"
                          color="light"
                          className="flex items-center gap-1"
                        >
                          <HiOutlineLink className="h-4 w-4" />
                          Buka Link
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white mb-2">
              Informasi
            </h5>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="bg-blue-100 dark:bg-blue-900 p-1 rounded-full mt-0.5">
                  <HiOutlineCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Notifikasi akan muncul di panel notifikasi pengguna
                </p>
              </div>

              <div className="flex items-start gap-2">
                <div className="bg-blue-100 dark:bg-blue-900 p-1 rounded-full mt-0.5">
                  <HiOutlineCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Pengguna akan melihat notifikasi saat mereka login ke sistem
                </p>
              </div>

              <div className="flex items-start gap-2">
                <div className="bg-yellow-100 dark:bg-yellow-900 p-1 rounded-full mt-0.5">
                  <HiOutlineExclamation className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Notifikasi tidak dikirim melalui email, hanya muncul di
                  aplikasi
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
