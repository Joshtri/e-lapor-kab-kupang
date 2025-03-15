"use client";

import UserFilterBar from "@/components/admin/users/user-filter-bar";
import UserGrid from "@/components/admin/users/user-grid-view";
import UserTable from "@/components/admin/users/user-table-view";
import CreateUserModal from "@/components/admin/users/users-create-modal";
import PageHeader from "@/components/ui/page-header";
import axios from "axios";
import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import { toast } from "sonner";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // default ke tabel
  const [filterRole, setFilterRole] = useState("ALL");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Gagal mengambil data users:", error);
      toast.error("Gagal mengambil data users.");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    filterRole === "ALL" ? true : user.role === filterRole,
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto p-4 space-y-6">
      <PageHeader
        showBackButton={false}
        title="Manajemen Users"
        showSearch={true}
        breadcrumbsProps={{
          home: { label: "Beranda", href: "/adm/dashboard" },

          customRoutes: {
            adm: { label: "Dashboard Admin", href: "/adm/dashboard" },
          },
        }}
      />
      <div className="flex justify-between items-center mb-6">
        <UserFilterBar
          filterRole={filterRole}
          setFilterRole={setFilterRole}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        <Button
          color="blue"
          onClick={() => setOpenModal(true)}
          icon={HiOutlinePlus}
        >
          Tambah User
        </Button>
      </div>

      {filteredUsers.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          Tidak ada user dengan filter ini.
        </p>
      ) : viewMode === "table" ? (
        <UserTable users={filteredUsers} />
      ) : (
        <UserGrid
          users={filteredUsers}
          onShow={(user) => console.log("Show", user)}
          onEdit={(user) => console.log("Edit", user)}
          onDelete={(user) => console.log("Delete", user)}
        />
      )}

      <CreateUserModal
        open={openModal}
        setOpen={setOpenModal}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
