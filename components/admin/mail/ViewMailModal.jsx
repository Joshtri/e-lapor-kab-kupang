"use client"

import { Button, Modal, Badge } from "flowbite-react"
import {
  HiOutlineReply,
  HiOutlineTrash,
  HiOutlinePaperClip,
  HiOutlineRefresh,
  HiOutlinePrinter,
  HiOutlineFastForward,
  HiOutlinePaperAirplane,
  HiOutlineDocumentDuplicate,
} from "react-icons/hi"

export default function ViewMailModal({ isOpen, onClose, mail, isTrash = false }) {
  if (!mail) return null

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

  return (
    <Modal show={isOpen} onClose={onClose} size="xl">
      <Modal.Header className="border-b">
        <div className="flex items-center gap-2">
          {isTrash ? (
            <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full">
              <HiOutlineTrash className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          ) : mail.type === "draft" ? (
            <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full">
              <HiOutlineDocumentDuplicate className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          ) : (
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
              <HiOutlinePaperAirplane className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          )}
          <div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">{mail.subject}</h3>
            {!isTrash && mail.status && (
              <Badge color={getStatusBadgeColor(mail.status)} className="mt-1">
                {getStatusBadgeText(mail.status)}
              </Badge>
            )}
            {isTrash && <p className="text-sm text-gray-500 dark:text-gray-400">Dihapus pada: {mail.deletedAt}</p>}
          </div>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <div className="flex justify-between items-start border-b pb-4">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Kepada: {mail.recipient.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{mail.recipient.email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{mail.date}</p>
            </div>
            {mail.hasAttachments && (
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                <HiOutlinePaperClip className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            )}
          </div>

          <div className="min-h-[200px] whitespace-pre-line text-gray-700 dark:text-gray-300">{mail.content}</div>

          {mail.hasAttachments && (
            <div className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Lampiran</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-white dark:bg-gray-700 p-2 rounded border">
                  <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded mr-2">
                      <HiOutlinePaperClip className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">dokumen-laporan.pdf</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">245.3 KB</p>
                    </div>
                  </div>
                  <Button color="light" size="xs">
                    Unduh
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-between w-full">
          <div>
            <Button color="light" onClick={onClose}>
              Tutup
            </Button>
          </div>

          <div className="flex gap-2">
            {isTrash ? (
              <>
                <Button color="success">
                  <HiOutlineRefresh className="mr-2 h-5 w-5" />
                  Pulihkan
                </Button>
                <Button color="failure">
                  <HiOutlineTrash className="mr-2 h-5 w-5" />
                  Hapus Permanen
                </Button>
              </>
            ) : (
              <>
                <Button color="light">
                  <HiOutlinePrinter className="mr-2 h-5 w-5" />
                  Cetak
                </Button>
                <Button color="blue">
                  <HiOutlineFastForward className="mr-2 h-5 w-5" />
                  Teruskan
                </Button>
                <Button color="blue">
                  <HiOutlineReply className="mr-2 h-5 w-5" />
                  Balas
                </Button>
              </>
            )}
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

