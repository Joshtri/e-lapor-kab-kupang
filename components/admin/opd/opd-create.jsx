"use client";

import { useState } from "react";
import { TextInput, Button, Label } from "flowbite-react";
import { toast } from "sonner";
import axios from "axios";
import PageHeader from "@/components/ui/page-header";

export default function OPDForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    wilayah: "",
    email: "",
    phoneNumber: "",
    kepalaOpdName: "",
    kepalaOpdNIP: "",
    kepalaOpdEmail: "",
    kepalaOpdPhone: "",
  });

  const handleSubmit = async () => {
    try {
      await axios.post("/api/opd", form);
      toast.success("OPD berhasil ditambahkan!");
      setForm({
        name: "",
        wilayah: "",
        email: "",
        phoneNumber: "",
        kepalaOpdName: "",
        kepalaOpdNIP: "",
        kepalaOpdEmail: "",
        kepalaOpdPhone: "",
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Gagal menambahkan OPD.");
    }
  };

  return (
    <>
      <PageHeader
        title={"Tambah OPD"}
        backHref="/adm/org-perangkat-daerah"
        breadcrumbsProps={{
          home: { label: "Beranda", href: "/adm/dashboard" },
          customRoutes: {
            adm: { label: "Dashboard Admin", href: "/adm/dashboard" },
            "org-perangkat-daerah": { label: "Manajemen OPD", href: "/adm/org-perangkat-daerah" },
            create: {
              label: "Tambah OPD",
              href: "/adm/org-perangkat-daerah/create",
            },
          },
        }}
      />
      <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div>
          <Label htmlFor="name" value="Nama OPD" />
          <TextInput
            id="name"
            placeholder="Nama Instansi"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="wilayah" value="Wilayah" />
          <TextInput
            id="wilayah"
            placeholder="Wilayah OPD"
            value={form.wilayah}
            onChange={(e) => setForm({ ...form, wilayah: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="kepalaOpdName" value="Nama Kepala OPD" />
          <TextInput
            id="kepalaOpdName"
            placeholder="Nama Kepala OPD"
            value={form.kepalaOpdName}
            onChange={(e) =>
              setForm({ ...form, kepalaOpdName: e.target.value })
            }
          />
        </div>

        <Button color="blue" onClick={handleSubmit}>
          Simpan
        </Button>
      </div>
    </>
  );
}
