'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  Button,
  Label,
  TextInput,
  Textarea,
  Breadcrumb,
  Spinner,
  Alert,
} from 'flowbite-react';
import {
  HiArrowLeft,
  HiOfficeBuilding,
  HiMail,
  HiPhone,
  HiGlobe,
  HiLocationMarker,
  HiExclamation,
} from 'react-icons/hi';
import axios from 'axios';
import { toast } from 'sonner';

export default function OrgPerangkatDaerahEditPage() {
  const params = useParams();
  const router = useRouter();
  const opdId = params.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [opd, setOpd] = useState({
    name: '',
    alamat: '',
    email: '',
    telp: '',
    website: '',
  });

  // Fetch OPD data
  useEffect(() => {
    const fetchOpd = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/opd/${opdId}`);
        setOpd(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching OPD:', err);
        setError('Gagal memuat data OPD. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    if (opdId) {
      fetchOpd();
    }
  }, [opdId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOpd({ ...opd, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!opd.name?.trim()) {
      toast.error('Nama OPD tidak boleh kosong');
      return;
    }

    // Email validation (if provided)
    if (opd.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(opd.email)) {
      toast.error('Format email tidak valid');
      return;
    }

    try {
      setSubmitting(true);
      await axios.patch(`/api/opd/${opdId}`, opd);
      toast.success('Data OPD berhasil diperbarui');
      router.push(`/adm/org-perangkat-daerah/${opdId}`);
    } catch (err) {
      console.error('Error updating OPD:', err);
      toast.error('Gagal memperbarui data OPD');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <Alert color="failure" icon={HiExclamation}>
          {error}
        </Alert>
        <div className="mt-4">
          <Button color="gray" onClick={() => router.back()}>
            <HiArrowLeft className="mr-2 h-5 w-5" />
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-5">
        <Breadcrumb.Item
          href={`/adm/org-perangkat-daerah/`}
          icon={HiArrowLeft}
        >
          Kembali ke Detail OPD
        </Breadcrumb.Item>
        <Breadcrumb.Item>Edit OPD</Breadcrumb.Item>
      </Breadcrumb>

      <Card className="mb-6">
        <div className="flex items-center mb-4">
          <HiOfficeBuilding className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-xl font-bold">Edit Data OPD</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" value="Nama OPD *" />
            <TextInput
              id="name"
              name="name"
              value={opd.name || ''}
              onChange={handleChange}
              required
              placeholder="Masukkan nama OPD"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="alamat" value="Alamat" />
            <Textarea
              id="alamat"
              name="alamat"
              value={opd.alamat || ''}
              onChange={handleChange}
              placeholder="Masukkan alamat OPD"
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" value="Email" />
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <HiMail className="w-5 h-5 text-gray-500" />
                </div>
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  value={opd.email || ''}
                  onChange={handleChange}
                  placeholder="contoh@email.com"
                  className="pl-10 mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="telp" value="Telepon" />
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <HiPhone className="w-5 h-5 text-gray-500" />
                </div>
                <TextInput
                  id="telp"
                  name="telp"
                  value={opd.telp || ''}
                  onChange={handleChange}
                  placeholder="Nomor telepon"
                  className="pl-10 mt-1"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="website" value="Website" />
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <HiGlobe className="w-5 h-5 text-gray-500" />
              </div>
              <TextInput
                id="website"
                name="website"
                value={opd.website || ''}
                onChange={handleChange}
                placeholder="www.example.com"
                className="pl-10 mt-1"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" color="blue" disabled={submitting}>
              {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
            <Button
              color="gray"
              onClick={() => router.push(`/adm/org-perangkat-daerah/${opdId}`)}
              disabled={submitting}
            >
              Batal
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
