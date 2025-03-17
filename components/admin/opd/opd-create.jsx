"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextInput, Button, Label } from "flowbite-react";
import { toast } from "sonner";
import axios from "axios";
import PageHeader from "@/components/ui/page-header";

export default function OPDForm({ onSuccess }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    try {
      await axios.post("/api/opd/create", form);
      toast.success("✅ OPD berhasil ditambahkan!");
      
      // Reset form setelah berhasil
      setForm({
        name: "",
        email: "",
        password: "",
      });

      // Redirect langsung setelah sukses
      router.push("/adm/org-perangkat-daerah");

      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.error || "❌ Gagal menambahkan OPD.");
    }
  };

  return (
    <>
      <PageHeader
        title="Tambah OPD"
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
          <Label htmlFor="email" value="Email OPD" />
          <TextInput
            id="email"
            type="email"
            placeholder="Email OPD"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="password" value="Password OPD" />
          <TextInput
            id="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <Button color="blue" onClick={handleSubmit}>
          Simpan
        </Button>
      </div>
    </>
  );
}
