'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Checkbox,
  Label,
  Select,
  Spinner,
  Textarea,
} from 'flowbite-react';
import {
  HiOutlineBell,
  HiOutlineUsers,
  HiOutlineOfficeBuilding,
  HiOutlineUserGroup,
  HiOutlinePaperAirplane,
  HiOutlineCheck,
  HiOutlineExclamation,
} from 'react-icons/hi';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const roleToPathPrefix = {
  ADMIN: 'adm',
  PELAPOR: 'pelapor',
  OPD: 'opd',
  BUPATI: 'bupati-portal',
};

export default function CreateNotification() {
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState('role');
  const [selectedRole, setSelectedRole] = useState('PELAPOR');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedOPDs, setSelectedOPDs] = useState([]);
  const [users, setUsers] = useState([]);
  const [opds, setOPDs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [previewCount, setPreviewCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersRes, opdsRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/opd/list'),
        ]);
        const [usersData, opdsData] = await Promise.all([
          usersRes.json(),
          opdsRes.json(),
        ]);
        setUsers(usersData);
        setOPDs(opdsData);
        setPreviewCount(usersData.filter((u) => u.role === 'PELAPOR').length);
      } catch {
        toast.error('Gagal mengambil data pengguna dan OPD');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (recipientType === 'role') {
      setPreviewCount(users.filter((u) => u.role === selectedRole).length);
    } else if (recipientType === 'specific') {
      setPreviewCount(selectedUsers.length);
    } else {
      setPreviewCount(selectedOPDs.length);
    }
  }, [recipientType, selectedRole, selectedUsers, selectedOPDs, users]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return toast.error('Pesan tidak boleh kosong');
    if (recipientType === 'specific' && selectedUsers.length === 0)
      return toast.error('Pilih minimal satu pengguna');
    if (recipientType === 'opd' && selectedOPDs.length === 0)
      return toast.error('Pilih minimal satu OPD');

    setSending(true);
    try {
      const payload = {
        message,
        recipientType,
        recipients:
          recipientType === 'role'
            ? { role: selectedRole }
            : recipientType === 'specific'
              ? { userIds: selectedUsers }
              : { opdIds: selectedOPDs },
      };
      const res = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      toast.success(`${data.count} notifikasi berhasil dikirim`);
      setMessage('');
      setSelectedUsers([]);
      setSelectedOPDs([]);
    } catch {
      toast.error('Terjadi kesalahan saat mengirim notifikasi');
    } finally {
      setSending(false);
    }
  };

  const toggleSelection = (list, setList, id) => {
    setList((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const selectAll = (type) => {
    if (type === 'PELAPOR' || type === 'OPD') {
      const ids = users.filter((u) => u.role === type).map((u) => u.id);
      setSelectedUsers(ids);
    } else if (type === 'ALL_OPD') {
      setSelectedOPDs(opds.map((o) => o.id));
    }
  };

  if (!mounted || loading) {
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

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => setRecipientType('role')}
              color={recipientType === 'role' ? 'blue' : 'light'}
            >
              <HiOutlineUserGroup /> Berdasarkan Role
            </Button>
            <Button
              type="button"
              onClick={() => setRecipientType('specific')}
              color={recipientType === 'specific' ? 'blue' : 'light'}
            >
              <HiOutlineUsers /> Pengguna Spesifik
            </Button>
            <Button
              type="button"
              onClick={() => setRecipientType('opd')}
              color={recipientType === 'opd' ? 'blue' : 'light'}
            >
              <HiOutlineOfficeBuilding /> OPD
            </Button>
          </div>

          {recipientType === 'role' && (
            <div>
              <Label htmlFor="role">Pilih Role</Label>
              <Select
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="PELAPOR">PELAPOR</option>
                <option value="OPD">OPD</option>
                <option value="ADMIN">ADMIN</option>
                <option value="BUPATI">BUPATI</option>
              </Select>
            </div>
          )}

          {recipientType === 'specific' && (
            <div>
              <Label>Pilih Pengguna</Label>
              <div className="flex gap-2 mb-2">
                <Button
                  size="xs"
                  type="button"
                  onClick={() => selectAll('PELAPOR')}
                >
                  Semua Pelapor
                </Button>
                <Button
                  size="xs"
                  type="button"
                  onClick={() => selectAll('OPD')}
                >
                  Semua OPD
                </Button>
                <Button
                  size="xs"
                  type="button"
                  onClick={() => setSelectedUsers([])}
                >
                  Reset
                </Button>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center mb-2">
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onChange={() =>
                        toggleSelection(
                          selectedUsers,
                          setSelectedUsers,
                          user.id,
                        )
                      }
                    />
                    <Label className="ml-2">
                      {user.name} ({user.role})
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recipientType === 'opd' && (
            <div>
              <Label>Pilih OPD</Label>
              <div className="flex gap-2 mb-2">
                <Button
                  size="xs"
                  type="button"
                  onClick={() => selectAll('ALL_OPD')}
                >
                  Pilih Semua
                </Button>
                <Button
                  size="xs"
                  type="button"
                  onClick={() => setSelectedOPDs([])}
                >
                  Reset
                </Button>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {opds.map((opd) => (
                  <div key={opd.id} className="flex items-center mb-2">
                    <Checkbox
                      checked={selectedOPDs.includes(opd.id)}
                      onChange={() =>
                        toggleSelection(selectedOPDs, setSelectedOPDs, opd.id)
                      }
                    />
                    <Label className="ml-2">{opd.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="message">Pesan Notifikasi</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
              className="resize-none"
            />
          </div>

          <Button
            type="submit"
            color="blue"
            isProcessing={sending}
            disabled={sending}
            className="w-full"
          >
            <HiOutlinePaperAirplane className="mr-2 h-5 w-5" />
            {sending ? 'Mengirim...' : 'Kirim Notifikasi'}
          </Button>
        </form>
      </Card>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <Card>
          <h5 className="font-bold">Ringkasan Notifikasi</h5>
          <p>
            <strong>Penerima:</strong>{' '}
            {recipientType === 'role'
              ? `Semua ${selectedRole}`
              : recipientType === 'specific'
                ? `${selectedUsers.length} pengguna`
                : `${selectedOPDs.length} OPD`}
          </p>
          <p>
            <strong>Jumlah:</strong> {previewCount}
          </p>
          {message && (
            <p className="mt-2">
              <strong>Pesan:</strong> {message}
            </p>
          )}
        </Card>

        <Card>
          <h5 className="font-bold">Informasi</h5>
          <ul className="text-sm space-y-2">
            <li>
              <HiOutlineCheck className="inline mr-1" /> Notifikasi muncul di
              panel pengguna
            </li>
            <li>
              <HiOutlineCheck className="inline mr-1" /> Tidak dikirim melalui
              email
            </li>
            <li>
              <HiOutlineExclamation className="inline mr-1 text-yellow-500" />{' '}
              Hanya tampil di aplikasi
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
