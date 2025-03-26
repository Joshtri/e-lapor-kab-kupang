"use client"

import { useState } from "react"
import { Table, Button, Card } from "flowbite-react"
import {
  HiOutlineSearch,
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiOutlineEye,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineDocumentDuplicate,
} from "react-icons/hi"
import { motion } from "framer-motion"
import ComposeMailModal from "@/components/admin/mail/ComposeMailCreateModal"

export default function DraftMailList() {
  const [viewMode, setViewMode] = useState("table")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDraft, setSelectedDraft] = useState(null)
  const [isComposeOpen, setIsComposeOpen] = useState(false)

  // Sample data - replace with actual API call
  const draftMails = [
    {
      id: "1",
      recipient: {
        name: "Ahmad Fauzi",
        email: "ahmad.fauzi@example.com",
        role: "PELAPOR",
      },
      subject: "Draft: Tanggapan Laporan Infrastruktur",
      content:
        "Dengan hormat,\n\nTerima kasih atas laporan yang Anda kirimkan mengenai kondisi infrastruktur di daerah Anda. Kami telah menerima laporan tersebut dan akan segera menindaklanjuti.\n\n",
      date: "15 Mei 2023",
      hasAttachments: false,
    },
    {
      id: "2",
      recipient: {
        name: "Budi Santoso",
        email: "budi.santoso@example.com",
        role: "OPD",
      },
      subject: "Draft: Permintaan Data Pendidikan",
      content:
        "Dengan hormat,\n\nMohon untuk mengirimkan data terkait kondisi pendidikan di wilayah Anda untuk periode Januari-April 2023.\n\n",
      date: "14 Mei 2023",
      hasAttachments: true,
    },
  ]

  // Filter drafts based on search query
  const filteredDrafts = draftMails.filter((draft) => {
    return [draft.recipient.name, draft.recipient.email, draft.subject, draft.content]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  })

  const handleEditDraft = (draft) => {
    setSelectedDraft(draft)
    setIsComposeOpen(true)
  }

  return (
    <div className="p-4">
      <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg mb-6 border border-yellow-100 dark:border-yellow-800">
        <h2 className="text-lg font-medium text-yellow-800 dark:text-yellow-300 mb-2 flex items-center gap-2">
          <HiOutlineDocumentDuplicate className="h-5 w-5" />
          Draft Pesan
        </h2>
        <p className="text-yellow-600 dark:text-yellow-400 text-sm">
          Daftar pesan yang belum selesai ditulis. Anda dapat melanjutkan menulis pesan atau menghapusnya dari daftar.
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
              placeholder="Cari draft pesan..."
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

      {/* Draft list - Table View */}
      {viewMode === "table" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
          <Table striped>
            <Table.Head>
              <Table.HeadCell>Penerima</Table.HeadCell>
              <Table.HeadCell>Subjek</Table.HeadCell>
              <Table.HeadCell>Tanggal</Table.HeadCell>
              <Table.HeadCell>Aksi</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {filteredDrafts.map((draft) => (
                <Table.Row key={draft.id}>
                  <Table.Cell>
                    <div className="flex flex-col">
                      <span className="font-medium">{draft.recipient.name}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{draft.recipient.email}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center">
                      <span className="font-medium truncate max-w-[250px]">{draft.subject}</span>
                      {draft.hasAttachments && <span className="ml-2 text-gray-500">📎</span>}
                    </div>
                  </Table.Cell>
                  <Table.Cell>{draft.date}</Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button color="yellow" size="xs" onClick={() => handleEditDraft(draft)}>
                        <HiOutlinePencil className="h-4 w-4" />
                      </Button>
                      <Button color="light" size="xs">
                        <HiOutlineEye className="h-4 w-4" />
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

      {/* Draft list - Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrafts.map((draft) => (
            <motion.div
              key={draft.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-t-4 border-yellow-500 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{draft.date}</p>
                  {draft.hasAttachments && <span className="text-gray-500 text-lg">📎</span>}
                </div>

                <div className="mt-3">
                  <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white truncate">
                    {draft.subject}
                  </h5>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full">
                      <HiOutlineDocumentDuplicate className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{draft.recipient.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{draft.recipient.email}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-700 dark:text-gray-300 line-clamp-3">{draft.content}</p>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button color="yellow" onClick={() => handleEditDraft(draft)} className="flex-1">
                    <HiOutlinePencil className="mr-2 h-5 w-5" />
                    Edit
                  </Button>
                  <Button color="light" className="flex-1">
                    <HiOutlineEye className="mr-2 h-5 w-5" />
                    Lihat
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

      {filteredDrafts.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center border border-gray-200 dark:border-gray-700">
          <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-full inline-block mb-4">
            <HiOutlineDocumentDuplicate className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Tidak ada draft pesan</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Anda belum memiliki draft pesan atau tidak ada draft yang cocok dengan pencarian Anda.
          </p>
        </div>
      )}

      {/* Compose Mail Modal for editing drafts */}
      <ComposeMailModal
        isOpen={isComposeOpen}
        onClose={() => {
          setIsComposeOpen(false)
          setSelectedDraft(null)
        }}
        initialRecipient={selectedDraft?.recipient.email || ""}
        initialSubject={selectedDraft?.subject.replace("Draft: ", "") || ""}
        initialContent={selectedDraft?.content || ""}
      />
    </div>
  )
}

