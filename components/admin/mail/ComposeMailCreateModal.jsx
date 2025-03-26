"use client"

import { useState, useRef, useEffect } from "react"
import { Button, Label, Modal, TextInput, Textarea, Select } from "flowbite-react"
import { HiOutlinePaperClip, HiOutlineX, HiPaperAirplane, HiOutlineSave, HiOutlineTrash } from "react-icons/hi"
import { toast } from "sonner"
import { motion } from "framer-motion"

export default function ComposeMailModal({
  isOpen,
  onClose,
  initialRecipient = "",
  initialSubject = "",
  initialContent = "",
}) {
  const [recipient, setRecipient] = useState(initialRecipient)
  const [subject, setSubject] = useState(initialSubject)
  const [content, setContent] = useState(initialContent)
  const [attachments, setAttachments] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [category, setCategory] = useState("")
  const [isDraft, setIsDraft] = useState(false)

  const fileInputRef = useRef(null)

  // Update form when props change
  useEffect(() => {
    if (isOpen) {
      setRecipient(initialRecipient)
      setSubject(initialSubject)
      setContent(initialContent)
      setIsDraft(initialContent !== "")
    }
  }, [isOpen, initialRecipient, initialSubject, initialContent])

  const handleAttachmentClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setAttachments([...attachments, ...newFiles])
    }
  }

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e, saveAsDraft = false) => {
    e.preventDefault()

    if (!recipient && !saveAsDraft) {
      toast.error("Harap isi alamat penerima")
      return
    }

    if (!subject && !saveAsDraft) {
      toast.error("Harap isi subjek pesan")
      return
    }

    if (!content && !saveAsDraft) {
      toast.error("Harap isi konten pesan")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (saveAsDraft) {
        toast.success("Draft berhasil disimpan!")
      } else {
        toast.success("Pesan berhasil dikirim!")
      }

      onClose()

      // Reset form
      setRecipient("")
      setSubject("")
      setContent("")
      setAttachments([])
      setCategory("")
      setIsDraft(false)
    } catch (error) {
      toast.error(saveAsDraft ? "Gagal menyimpan draft." : "Gagal mengirim pesan. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveAsDraft = (e) => {
    handleSubmit(e, true)
  }

  return (
    <Modal show={isOpen} onClose={onClose} size="xl" popup>
      <Modal.Header className="border-b">
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <HiPaperAirplane className="text-blue-600 dark:text-blue-400" />
            {isDraft ? "Edit Draft Pesan" : "Buat Pesan Baru"}
          </h3>
        </div>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="recipient" value="Kepada" />
            </div>
            <TextInput
              id="recipient"
              placeholder="Masukkan alamat email penerima"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required={!isDraft}
              className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800"
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="category" value="Kategori" />
            </div>
            <Select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required={!isDraft}
              className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800"
            >
              <option value="" disabled>
                Pilih kategori pesan
              </option>
              <option value="infrastruktur">Infrastruktur</option>
              <option value="pendidikan">Pendidikan</option>
              <option value="kesehatan">Kesehatan</option>
              <option value="ekonomi">Ekonomi</option>
              <option value="sosial">Sosial</option>
              <option value="lainnya">Lainnya</option>
            </Select>
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="subject" value="Subjek" />
            </div>
            <TextInput
              id="subject"
              placeholder="Masukkan subjek pesan"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required={!isDraft}
              className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800"
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="content" value="Isi Pesan" />
            </div>
            <Textarea
              id="content"
              placeholder="Tulis isi pesan Anda di sini..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required={!isDraft}
              rows={8}
              className="resize-none bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800"
            />
          </div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <Label value="Lampiran" className="mb-2 block" />
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between bg-white dark:bg-gray-700 p-2 rounded border"
                  >
                    <div className="flex items-center">
                      <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded mr-2">
                        <HiOutlinePaperClip className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="truncate max-w-[200px]">
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <Button color="light" size="xs" onClick={() => removeAttachment(index)}>
                      <HiOutlineX />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
              <Button color="light" size="sm" onClick={handleAttachmentClick} type="button">
                <HiOutlinePaperClip className="mr-2 h-5 w-5" />
                Lampirkan File
              </Button>
            </div>

            <div className="flex gap-2">
              {isDraft && (
                <Button color="failure" onClick={onClose} type="button">
                  <HiOutlineTrash className="mr-2 h-5 w-5" />
                  Hapus Draft
                </Button>
              )}
              <Button color="yellow" onClick={handleSaveAsDraft} type="button">
                <HiOutlineSave className="mr-2 h-5 w-5" />
                Simpan Draft
              </Button>
              <Button color="light" onClick={onClose} type="button">
                Batal
              </Button>
              <Button color="blue" type="submit" isProcessing={isSubmitting} disabled={isSubmitting}>
                {isSubmitting ? (
                  "Mengirim..."
                ) : (
                  <>
                    <HiPaperAirplane className="mr-2 h-5 w-5" />
                    Kirim Pesan
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}

