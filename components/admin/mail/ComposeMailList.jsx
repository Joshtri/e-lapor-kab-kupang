"use client"

import { useState } from "react"
import { Table, Badge, Button, Card, Select } from "flowbite-react"
import {
  HiOutlineMail,
  HiOutlineSearch,
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiOutlineOfficeBuilding,
  HiOutlineUser,
} from "react-icons/hi"
import { motion } from "framer-motion"

export default function ComposeMailList({ users, onComposeToUser }) {
  const [viewMode, setViewMode] = useState("table")
  const [filterRole, setFilterRole] = useState("ALL")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter users based on role and search query
  const filteredUsers = users.filter((user) => {
    const roleMatch = filterRole === "ALL" || user.role === filterRole

    const searchMatch = [user.name, user.email, user.username, user.role, user.opd?.name]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())

    return roleMatch && searchMatch
  })

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "purple"
      case "BUPATI":
        return "green"
      case "OPD":
        return "indigo"
      default:
        return "blue"
    }
  }

  return (
    <div className="p-4">
      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-6 border border-blue-100 dark:border-blue-800">
        <h2 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
          <HiOutlineMail className="h-5 w-5" />
          Pilih Penerima Pesan
        </h2>
        <p className="text-blue-600 dark:text-blue-400 text-sm">
          Pilih pengguna dari daftar di bawah untuk mengirim pesan laporan. Anda dapat memfilter berdasarkan role atau
          mencari pengguna tertentu.
        </p>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <HiOutlineSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Cari pengguna..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="w-auto">
          <option value="ALL">Semua Role</option>
          <option value="PELAPOR">Pelapor</option>
          <option value="ADMIN">Admin</option>
          <option value="BUPATI">Bupati</option>
          <option value="OPD">OPD</option>
        </Select>

        <div className="flex gap-2">
          <Button color={viewMode === "table" ? "blue" : "gray"} onClick={() => setViewMode("table")}>
            <HiOutlineViewList className="mr-2 h-5 w-5" />
            Tabel
          </Button>
          <Button color={viewMode === "grid" ? "blue" : "gray"} onClick={() => setViewMode("grid")}>
            <HiOutlineViewGrid className="mr-2 h-5 w-5" />
            Grid
          </Button>
        </div>
      </div>

      {/* User list - Table View */}
      {viewMode === "table" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
          <Table striped>
            <Table.Head>
              <Table.HeadCell>Nama</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Role</Table.HeadCell>
              <Table.HeadCell>Aksi</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {filteredUsers.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      {user.role === "OPD" && user.opd?.name && (
                        <span className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-1">
                          <HiOutlineOfficeBuilding className="inline h-4 w-4" />
                          <span>{user.opd.name}</span>
                        </span>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    <Badge color={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Button color="blue" size="xs" onClick={() => onComposeToUser(user)}>
                      <HiOutlineMail className="mr-2 h-4 w-4" />
                      Kirim Pesan
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}

      {/* User list - Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                    <HiOutlineUser className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">{user.name}</h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400">{user.email}</p>
                    {user.role === "OPD" && user.opd?.name && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <HiOutlineOfficeBuilding className="h-4 w-4" />
                        {user.opd.name}
                      </p>
                    )}
                    <Badge color={getRoleBadgeColor(user.role)} className="mt-2">
                      {user.role}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4">
                  <Button color="blue" onClick={() => onComposeToUser(user)} className="w-full">
                    <HiOutlineMail className="mr-2 h-5 w-5" />
                    Kirim Pesan
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {filteredUsers.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center border border-gray-200 dark:border-gray-700">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full inline-block mb-4">
            <HiOutlineMail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Tidak ada pengguna ditemukan</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Tidak ada pengguna yang cocok dengan filter saat ini. Coba ubah filter atau kata kunci pencarian.
          </p>
        </div>
      )}
    </div>
  )
}

