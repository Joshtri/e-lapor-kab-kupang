'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { HiOutlineCog, HiOutlineExclamation } from 'react-icons/hi';
import { toast } from 'sonner';

export default function SettingsPage() {
    const queryClient = useQueryClient();
    const [maintenanceMessage, setMaintenanceMessage] = useState('');

    // Fetch settings
    const { data: settings, isLoading } = useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            const res = await fetch('/api/settings');
            if (!res.ok) throw new Error('Gagal mengambil pengaturan');
            const data = await res.json();
            setMaintenanceMessage(data.maintenanceMessage || '');
            return data;
        }
    });

    // Update settings mutation
    const updateSettings = useMutation({
        mutationFn: async (data) => {
            const res = await fetch('/api/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Gagal memperbarui pengaturan');
            return res.json();
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['settings'], data);
            toast.success('Pengaturan berhasil diperbarui');
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const handleToggleMaintenance = () => {
        const newMode = !settings?.maintenanceMode;
        updateSettings.mutate({
            maintenanceMode: newMode,
            maintenanceMessage: maintenanceMessage || settings?.maintenanceMessage
        });
    };

    const handleUpdateMessage = (e) => {
        e.preventDefault();
        updateSettings.mutate({
            maintenanceMode: settings?.maintenanceMode,
            maintenanceMessage
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <HiOutlineCog className="text-blue-600" />
                    Pengaturan Sistem
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Kelola pengaturan dan konfigurasi sistem
                </p>
            </div>

            {/* Maintenance Mode Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Mode Pemeliharaan
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Aktifkan mode pemeliharaan untuk menonaktifkan akses sementara ke sistem.
                            Hanya admin yang dapat mengakses sistem saat mode ini aktif.
                        </p>

                        {settings?.maintenanceMode && (
                            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg mb-4">
                                <HiOutlineExclamation className="text-xl flex-shrink-0" />
                                <span className="text-sm font-medium">
                                    Mode pemeliharaan sedang aktif. Pengguna non-admin tidak dapat mengakses sistem.
                                </span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleToggleMaintenance}
                        disabled={updateSettings.isPending}
                        className={`relative inline-flex h-10 w-20 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${settings?.maintenanceMode
                                ? 'bg-orange-600'
                                : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                    >
                        <span
                            className={`inline-block h-9 w-9 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings?.maintenanceMode ? 'translate-x-10' : 'translate-x-0'
                                }`}
                        />
                    </button>
                </div>

                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <form onSubmit={handleUpdateMessage}>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Pesan Pemeliharaan
                        </label>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            Pesan yang akan ditampilkan kepada pengguna saat mode pemeliharaan aktif
                        </p>
                        <textarea
                            value={maintenanceMessage}
                            onChange={(e) => setMaintenanceMessage(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Masukkan pesan pemeliharaan..."
                        />
                        <button
                            type="submit"
                            disabled={updateSettings.isPending || !maintenanceMessage.trim()}
                            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {updateSettings.isPending ? 'Menyimpan...' : 'Simpan Pesan'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                    ℹ️ Informasi
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                    <li>• Admin dapat tetap mengakses sistem saat mode pemeliharaan aktif</li>
                    <li>• Pengguna lain akan melihat halaman pemeliharaan dengan pesan yang telah Anda atur</li>
                    <li>• Pastikan untuk menonaktifkan mode pemeliharaan setelah selesai</li>
                </ul>
            </div>
        </div>
    );
}