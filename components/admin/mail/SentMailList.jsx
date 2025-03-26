"use client"

import { useState } from "react"
import { Table, Badge, Button, Card } from "flowbite-react"
import {
  HiOutlineSearch,
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiOutlineEye,
  HiOutlineTrash,
  HiOutlinePaperAirplane,
  HiOutlineReply,
} from "react-icons/hi"
import { motion } from "framer-motion"
import ViewMailModal from "@/components/admin/mail/ViewMailModal"

export default function SentMailList() {
  const [viewMode, setViewMode] = useState("table")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMail, setSelectedMail] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  // Sample data - replace with actual API call
  const sentMails = [
    {
      id: "1",
      recipient: {
        name: "Ahmad Fauzi",
        email: "ahmad.fauzi@example.com",
        role: "PELAPOR",
      },
      subject: "Tanggapan Laporan Infrastruktur",
      content:
        "Dengan hormat,\n\nTerima kasih atas laporan yang Anda kirimkan mengenai kondisi infrastruktur di daerah Anda. Kami telah menerima laporan tersebut dan akan segera menindaklanjuti.\n\nKami akan memberikan informasi lebih lanjut mengenai perkembangan penanganan laporan Anda.\n\nSalam,\nAdmin",
      date: "15 Mei 2023",
      status: "delivered",
      hasAttachments: true,
    },
    {
      id: "2",
      recipient: {
        name: "Budi Santoso",
        email: "budi.santoso@example.com",
        role: "OPD",
      },
      subject: "Permintaan Tindak Lanjut Laporan Pendidikan",
      content:
        "Dengan hormat,\n\nMohon untuk segera menindaklanjuti laporan mengenai kondisi pendidikan di daerah Anda. Laporan tersebut telah kami terima dan perlu penanganan segera.\n\nMohon untuk memberikan laporan perkembangan penanganan dalam waktu 3 hari kerja.\n\nSalam,\nAdmin",
      date: "14 Mei 2023",
      status: "read",
      hasAttachments: false,
    },
    {
      id: "3",
      recipient: {
        name: "Citra Dewi",
        email: "citra.dewi@example.com",
        role: "BUPATI",
      },
      subject: "Laporan Bulanan Kinerja OPD",
      content:
        "Dengan hormat,\n\nBerikut kami lampirkan laporan bulanan kinerja OPD untuk bulan April 2023. Laporan ini berisi ringkasan kinerja seluruh OPD dalam menangani laporan masyarakat.\n\nMohon untuk ditinjau dan diberikan arahan lebih lanjut.\n\nSalam,\nAdmin",
      date: "10 Mei 2023",
      status: "delivered",
      hasAttachments: true,
    },
  ]

  // Filter mails based on search query
  const filteredMails = sentMails.filter((mail) => {
    return [mail.recipient.name, mail.recipient.email, mail.subject, mail.content]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  })

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "delivered":
        return "blue"
      case "read":
        return "green"
      default:
        return "gray"
    }
  }

  // Get status badge text
  const getStatusBadgeText = (status) => {
    switch (status) {
      case "delivered":
        return "Terkirim"
      case "read":
        return "Dibaca"
      default:
        return "Unknown"
    }
  }

  const handleViewMail = (mail) => {
    setSelectedMail(mail)
    setIsViewModalOpen(true)
  }

  return (
    <div className="p-4">
      <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg mb-6 border border-green-100 dark:border-green-800">
        <h2 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
          <HiOutlinePaperAirplane className="h-5 w-5" />
          Pesan Terkirim
        </h2>
        <p className="text-green-600 dark:text-green-400 text-sm">
          Daftar pesan yang telah Anda kirim. Anda dapat melihat detail pesan atau menghapusnya dari daftar.
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
              placeholder="Cari pesan terkirim..."
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
              <Table.HeadCell>Tanggal</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
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
                  <Table.Cell>{mail.date}</Table.Cell>
                  <Table.Cell>
                    <Badge color={getStatusBadgeColor(mail.status)}>{getStatusBadgeText(mail.status)}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button color="light" size="xs" onClick={() => handleViewMail(mail)}>
                        <HiOutlineEye className="h-4 w-4" />
                      </Button>
                      <Button color="blue" size="xs">
                        <HiOutlineReply className="h-4 w-4" />
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
              <Card className="border-t-4 border-green-500 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge color={getStatusBadgeColor(mail.status)}>{getStatusBadgeText(mail.status)}</Badge>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{mail.date}</p>
                  </div>
                  {mail.hasAttachments && <span className="text-gray-500 text-lg">📎</span>}
                </div>

                <div className="mt-3">
                  <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white truncate">
                    {mail.subject}
                  </h5>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                      <HiOutlinePaperAirplane className="h-4 w-4 text-green-600 dark:text-green-400" />
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
                  <Button color="blue" className="flex-1">
                    <HiOutlineReply className="mr-2 h-5 w-5" />
                    Balas
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
          <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full inline-block mb-4">
            <HiOutlinePaperAirplane className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Tidak ada pesan terkirim</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Anda belum mengirim pesan atau tidak ada pesan yang cocok dengan pencarian Anda.
          </p>
        </div>
      )}

      {/* View Mail Modal */}
      <ViewMailModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} mail={selectedMail} />
    </div>
  )
}

