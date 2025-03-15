"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Spinner } from "flowbite-react";
import { HiOutlinePlus } from "react-icons/hi";
import { toast } from "sonner";
import OPDFilterBar from "@/components/admin/opd/opd-filter-bar";
import OPDGrid from "@/components/admin/opd/opd-grid-view";
import OPDTable from "@/components/admin/opd/opd-table-view";
import CreateOPDModal from "@/components/admin/opd/opd-create";
import PageHeader from "@/components/ui/page-header";
import { useRouter } from "next/navigation";

export default function OPDList() {
  const [opdList, setOpdList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [filterWilayah, setFilterWilayah] = useState("ALL");

  const router = useRouter();

  useEffect(() => {
    fetchOPD();
  }, []);

  const fetchOPD = async () => {
    try {
      const res = await axios.get("/api/opd");
      setOpdList(res.data);
    } catch (error) {
      console.error("Gagal mengambil data OPD:", error);
      toast.error("Gagal mengambil data OPD.");
    } finally {
      setLoading(false);
    }
  };

  const filteredOPD = opdList.filter((opd) =>
    filterWilayah === "ALL" ? true : opd.wilayah === filterWilayah
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const handleAddOPD = () => {
    router.push("/adm/org-perangkat-daerah/create"); // 🔹 Pindah ke halaman pembuatan OPD
  };


  return (
    <div className="max-w-full mx-auto p-4 space-y-6">
      <PageHeader
        showBackButton={false}
        title="Manajemen OPD"
        showSearch={true}
        breadcrumbsProps={{
          home: { label: "Beranda", href: "/adm/dashboard" },
          customRoutes: {
            adm: { label: "Dashboard Admin", href: "/adm/dashboard" },
          },
        }}
      />

      <div className="flex justify-between items-center mb-6">
        <OPDFilterBar
          filterWilayah={filterWilayah}
          setFilterWilayah={setFilterWilayah}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <Button color="blue" onClick={() => handleAddOPD(true)} icon={HiOutlinePlus}>
          Tambah OPD
        </Button>
      </div>

      {filteredOPD.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">Tidak ada OPD dengan filter ini.</p>
      ) : viewMode === "table" ? (
        <OPDTable opdList={filteredOPD} />
      ) : (
        <OPDGrid opdList={filteredOPD} />
      )}

     </div>
  );
}
