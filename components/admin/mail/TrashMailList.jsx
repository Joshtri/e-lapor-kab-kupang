"use client"

import { useState } from "react"
import { Table, Badge, Button, Card } from "flowbite-react"
import {
  HiOutlineSearch,
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiOutlineEye,
  HiOutlineTrash,
  HiOutlineRefresh,
} from "react-icons/hi"
import { motion } from "framer-motion"
import ViewMailModal from "@/components/admin/mail/ViewMailModal"

export default function TrashMailList() {
  const [viewMode, setViewMode] = useState("table")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMail, setSelectedMail] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  // Sample data - replace with actual API call
  const trashMails = [
    {
      id: "1",
      type: "sent",
      recipient: {
        name: "Ahmad Fauzi",
        email: "ahmad.fauzi@example.com",
        role: "PELAPOR",
      },
      subject: "Tanggapan Laporan Infrastruktur",
      content:
        "Dengan hormat,\n\nTerima kasih atas laporan yang Anda kirimkan mengenai kondisi infrastruktur di daerah Anda. Kami telah menerima laporan tersebut dan akan segera menindaklanjuti.\n\nKami akan memberikan informasi lebih lanjut mengenai perkembangan penanganan laporan Anda.\n\nSalam,\nAdmin",
      date: "15 Mei 2023",
      deletedAt: "20 Mei 2023",
      hasAttachments: true,
    },
    {
      id: "2",
      type: "draft",
      recipient: {
        name: "Budi Santoso",
        email: "budi.santoso@example.com",
        role: "OPD",
      },
      subject: "Draft: Permintaan Data Pendidikan",
      content:
        "Dengan hormat,\n\nMohon untuk mengirimkan data terkait kondisi pendidikan di wilayah Anda untuk periode Januari-April 2023.\n\n",
      date: "14 Mei 2023",
      deletedAt: "19 Mei 2023",
      hasAttachments: false,
    },
  ]

  // Filter mails based on search query
  const filteredMails = trashMails.filter((mail) => {
    return [mail.recipient.name, mail.recipient.email, mail.subject, mail.content]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  })

  const handleViewMail = (mail) => {
    setSelectedMail(mail)
    setIsViewModalOpen(true)
  }

  return (
    <div className="p-4">
      <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg mb-6 border border-red-100 dark:border-red-800">
        <h2 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2 flex items-center gap-2">
          <HiOutlineTrash className="h-5 w-5" />
          Sampah
        </h2>
        <p className="text-red-600 dark:text-red-400 text-sm">
          Pesan yang telah dihapus akan disimpan di sini selama 30 hari sebelum dihapus secara permanen. Anda dapat
          memulihkan pesan yang dihapus.
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
              placeholder="Cari pesan di sampah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

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

      {/* Mail list - Table View */}
      {viewMode === "table" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
          <Table striped>
            <Table.Head>
              <Table.HeadCell>Penerima</Table.HeadCell>
              <Table.HeadCell>Subjek</Table.HeadCell>
              <Table.HeadCell>Dihapus Pada</Table.HeadCell>
              <Table.HeadCell>Tipe</Table.HeadCell>
              <Table.HeadCell>Aksi</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {filteredMails.map((mail) => (
                <Table.Row key={mail.id}>
                  <Table.Cell>
                    <div className="flex flex-col">
                      <span className="font-medium">{mail.recipient.name}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{mail.recipient.email}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center">
                      <span className="font-medium truncate max-w-[250px]">{mail.subject}</span>
                      {mail.hasAttachments && <span className="ml-2 text-gray-500">📎</span>}
                    </div>
                  </Table.Cell>
                  <Table.Cell>{mail.deletedAt}</Table.Cell>
                  <Table.Cell>
                    <Badge color={mail.type === "sent" ? "green" : "yellow"}>
                      {mail.type === "sent" ? "Terkirim" : "Draft"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button color="light" size="xs" onClick={() => handleViewMail(mail)}>
                        <HiOutlineEye className="h-4 w-4" />
                      </Button>
                      <Button color="success" size="xs">
                        <HiOutlineRefresh className="h-4 w-4" />
                      </Button>
                      <Button color="failure" size="xs">
                        <HiOutlineTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}

      {/* Mail list - Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMails.map((mail) => (
            <motion.div
              key={mail.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-t-4 border-red-500 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge color={mail.type === "sent" ? "green" : "yellow"}>
                      {mail.type === "sent" ? "Terkirim" : "Draft"}
                    </Badge>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Dihapus: {mail.deletedAt}</p>
                  </div>
                  {mail.hasAttachments && <span className="text-gray-500 text-lg">📎</span>}
                </div>

                <div className="mt-3">
                  <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white truncate">
                    {mail.subject}
                  </h5>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full">
                      <HiOutlineTrash className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{mail.recipient.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{mail.recipient.email}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-700 dark:text-gray-300 line-clamp-3">{mail.content}</p>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button color="light" onClick={() => handleViewMail(mail)} className="flex-1">
                    <HiOutlineEye className="mr-2 h-5 w-5" />
                    Lihat
                  </Button>
                  <Button color="success" className="flex-1">
                    <HiOutlineRefresh className="mr-2 h-5 w-5" />
                    Pulihkan
                  </Button>
                  <Button color="failure" className="flex-1">
                    <HiOutlineTrash className="mr-2 h-5 w-5" />
                    Hapus
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {filteredMails.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center border border-gray-200 dark:border-gray-700">
          <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full inline-block mb-4">
            <HiOutlineTrash className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Sampah Kosong</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Tidak ada pesan yang dihapus atau tidak ada pesan yang cocok dengan pencarian Anda.
          </p>
        </div>
      )}

      {/* View Mail Modal */}
      <ViewMailModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        mail={selectedMail}
        isTrash={true}
      />
    </div>
  )
}

