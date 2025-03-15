"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]); // 🔥 Untuk daftar pelapor
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
    fetchUsers(); // ✅ Ambil semua user dengan role PELAPOR
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/auth/me");
      setUser(res.data.user);
    } catch (error) {
      console.error("Gagal mengambil user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users"); // 🔥 Ambil semua users
      const pelaporUsers = res.data.filter((u) => u.role === "PELAPOR"); // ✅ Filter hanya PELAPOR
      setUsers(pelaporUsers);
    } catch (error) {
      console.error("Gagal mengambil daftar pelapor:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, users, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
