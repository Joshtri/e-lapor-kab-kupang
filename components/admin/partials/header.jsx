"use client";

import React from "react";
import { Navbar, Button, Modal } from "flowbite-react";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { useTheme } from "next-themes";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const AdminHeader = ({ toggleSidebar }) => {
  const { theme, setTheme } = useTheme();
  const [openModal, setOpenModal] = React.useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      toast.success("Logout berhasil! Anda akan diarahkan ke halaman utama.");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      toast.error("Terjadi kesalahan saat logout.");
    }
  };

  return (
    <Navbar fluid rounded className="py-4 px-6 bg-white dark:bg-gray-800 shadow-lg fixed w-full z-40 top-0 left-0">
      <button onClick={toggleSidebar} className="text-gray-900 dark:text-gray-100 focus:outline-none">
        <HiOutlineChatAlt2 className="h-8 w-8 text-green-600 dark:text-green-400" />
      </button>
      <span className="text-2xl font-bold text-gray-800 dark:text-gray-200 ml-4">Admin Panel</span>

      <div className="flex md:order-2 items-center space-x-3">
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition duration-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          aria-label="Toggle Dark Mode"
        >
          {theme === "light" ? <BsMoonStarsFill className="text-gray-700 dark:text-gray-300 text-lg" /> : <BsSunFill className="text-yellow-400 text-lg" />}
        </button>
        <Button color="failure" onClick={() => setOpenModal(true)} className="font-medium">
          Logout
        </Button>
      </div>

      <Modal show={openModal} onClose={() => setOpenModal(false)} size="md">
        <Modal.Header>Konfirmasi Logout</Modal.Header>
        <Modal.Body>
          <p className="text-gray-600 dark:text-gray-300">Apakah Anda yakin ingin logout dari akun ini?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="failure" onClick={handleLogout}>Ya, Logout</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>Batal</Button>
        </Modal.Footer>
      </Modal>
    </Navbar>
  );
};

export default AdminHeader;
