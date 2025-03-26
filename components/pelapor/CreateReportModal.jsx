"use client"

import { useState, useEffect } from "react"
import { Modal, Button, Label, Textarea, Select, FileInput, TextInput } from "flowbite-react"
import { toast } from "sonner"
import axios from "axios"
import {
  HiOutlineMail,
  HiMailOpen,
  HiPaperAirplane,
  HiOutlinePhotograph,
  HiOutlineExclamationCircle,
  HiExclamation,
  HiTag,
  HiFlag,
  HiOfficeBuilding,
} from "react-icons/hi"
import { motion, AnimatePresence } from "framer-motion"

const ReportModal = ({ openModal, setOpenModal, user, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "LOW",
    opdId: "",
    location: "",
    status: "PENDING",
  })
  const [opds, setOpds] = useState([])
  const [files, setFiles] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState({})
  const [loadingOpds, setLoadingOpds] = useState(true)

  // Fetch OPDs when component mounts
  useEffect(() => {
    fetchOpds()
  }, [])

  const fetchOpds = async () => {
    try {
      setLoadingOpds(true)
      const res = await axios.get("/api/opd/list")
      setOpds(res.data)
    } catch (error) {
      console.error("Gagal mengambil OPD:", error)
      toast.error("Gagal mengambil daftar OPD.")
    } finally {
      setLoadingOpds(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files))

    // Clear error when user selects files
    if (errors.files) {
      setErrors((prev) => ({ ...prev, files: "" }))
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "red"
      case "MEDIUM":
        return "yellow"
      case "LOW":
        return "blue"
      default:
        return "blue"
    }
  }

  const validateStep1 = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Judul laporan wajib diisi"
    }

    if (!formData.category) {
      newErrors.category = "Kategori wajib dipilih"
    }

    if (!formData.priority) {
      newErrors.priority = "Prioritas wajib dipilih"
    }

    if (!formData.opdId) {
      newErrors.opdId = "OPD tujuan wajib dipilih"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}

    if (!formData.description.trim()) {
      newErrors.description = "Deskripsi laporan wajib diisi"
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Deskripsi terlalu pendek (minimal 20 karakter)"
    }

    if (!formData.location.trim()) {
      newErrors.location = "Lokasi wajib diisi"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      // Create form data for file upload
      const formDataObj = new FormData()
      formDataObj.append("title", formData.title)
      formDataObj.append("description", formData.description)
      formDataObj.append("category", formData.category)
      formDataObj.append("priority", formData.priority)
      formDataObj.append("opdId", formData.opdId)
      formDataObj.append("location", formData.location)
      formDataObj.append("status", formData.status)
      formDataObj.append("userId", user.id)

      // Append files
      files.forEach((file) => {
        formDataObj.append("files", file)
      })

      await axios.post("/api/reports", formDataObj)

      toast.success("Laporan berhasil dikirim!", {
        icon: <HiPaperAirplane className="h-5 w-5 text-green-500 rotate-90" />,
      })

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "LOW",
        opdId: "",
        location: "",
        status: "PENDING",
      })
      setFiles([])
      setStep(1)
      setOpenModal(false)

      // Trigger refetch of stats
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Error submitting report:", error)
      toast.error(error.response?.data?.error || "Gagal mengirim laporan. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setOpenModal(false)
      // Reset form state when modal is closed
      setTimeout(() => {
        setFormData({
          title: "",
          description: "",
          category: "",
          priority: "LOW",
          opdId: "",
          location: "",
          status: "PENDING",
        })
        setFiles([])
        setStep(1)
        setErrors({})
      }, 300)
    }
  }

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center w-full max-w-xs">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= i ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                {i}
              </div>
              {i < 3 && (
                <div className={`h-1 flex-1 ${step > i ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Modal show={openModal} onClose={handleCloseModal} size="lg" className="mail-themed-modal">
      <Modal.Header className="border-b-4 border-blue-500 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
        <div className="flex items-center gap-2">
          {step === 1 && <HiOutlineMail className="h-5 w-5 text-blue-600" />}
          {step === 2 && <HiMailOpen className="h-5 w-5 text-blue-600" />}
          {step === 3 && <HiPaperAirplane className="h-5 w-5 text-blue-600" />}
          <span>
            {step === 1 && "Buat Laporan Baru - Informasi Dasar"}
            {step === 2 && "Buat Laporan Baru - Detail Laporan"}
            {step === 3 && "Buat Laporan Baru - Konfirmasi"}
          </span>
        </div>
      </Modal.Header>

      <Modal.Body className="bg-blue-50 dark:bg-gray-800">
        {renderStepIndicator()}

        {/* Info Banner */}
        <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/30">
          <div className="flex items-start">
            <div className="bg-blue-100 dark:bg-blue-800/50 p-2 rounded-full mr-3">
              <HiExclamation className="text-blue-600 dark:text-blue-400 h-5 w-5" />
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Silakan isi formulir di bawah ini dengan lengkap dan jelas. Laporan Anda akan diteruskan ke OPD terkait dan Bupati.
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 mb-4">
                <form className="space-y-5">
                  {/* Judul Laporan */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="flex items-center text-gray-700 dark:text-gray-300">
                      <HiTag className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                      Judul Laporan <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <TextInput
                      id="title"
                      name="title"
                      placeholder="Masukkan judul laporan..."
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className={`border-gray-300 dark:border-gray-600 ${
                        errors.title ? "border-red-500 dark:border-red-500" : ""
                      }`}
                    />
                    {errors.title ? (
                      <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400">
                        <HiOutlineExclamationCircle className="mr-1 h-4 w-4" />
                        {errors.title}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Berikan judul yang singkat dan jelas tentang laporan Anda
                      </p>
                    )}
                  </div>

                  {/* Kategori */}
                  <div className="space-y-2">
                    <Label htmlFor="category" className="flex items-center text-gray-700 dark:text-gray-300">
                      <HiTag className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                      Kategori Laporan <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className={`border-gray-300 dark:border-gray-600 ${
                        errors.category ? "border-red-500 dark:border-red-500" : ""
                      }`}
                    >
                      <option value="">Pilih Kategori</option>
                      <option value="INFRASTRUKTUR">Infrastruktur</option>
                      <option value="PELAYANAN">Pelayanan Publik</option>
                      <option value="SOSIAL">Permasalahan Sosial</option>
                      <option value="LAINNYA">Lainnya</option>
                    </Select>
                    {errors.category && (
                      <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400">
                        <HiOutlineExclamationCircle className="mr-1 h-4 w-4" />
                        {errors.category}
                      </div>
                    )}
                  </div>

                  {/* Prioritas */}
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="flex items-center text-gray-700 dark:text-gray-300">
                      <HiFlag className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                      Prioritas <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      required
                      className={`border-gray-300 dark:border-gray-600 ${
                        errors.priority ? "border-red-500 dark:border-red-500" : ""
                      }`}
                    >
                      <option value="LOW">Rendah</option>
                      <option value="MEDIUM">Sedang</option>
                      <option value="HIGH">Tinggi</option>
                    </Select>
                    {errors.priority ? (
                      <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400">
                        <HiOutlineExclamationCircle className="mr-1 h-4 w-4" />
                        {errors.priority}
                      </div>
                    ) : (
                      <div className="flex items-center mt-1">
                        <div
                          className="w-3 h-3 rounded-full mr-1"
                          style={{ backgroundColor: `var(--flowbite-${getPriorityColor(formData.priority)}-500)` }}
                        ></div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formData.priority === "HIGH"
                            ? "Memerlukan penanganan segera"
                            : formData.priority === "MEDIUM"
                            ? "Penanganan dalam waktu dekat"
                            : "Penanganan sesuai antrian"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* OPD Tujuan */}
                  <div className="space-y-2">
                    <Label htmlFor="opdId" className="flex items-center text-gray-700 dark:text-gray-300">
                      <HiOfficeBuilding className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                      OPD Tujuan <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Select
                      id="opdId"
                      name="opdId"
                      value={formData.opdId}
                      onChange={handleChange}
                      required
                      disabled={loadingOpds}
                      className={`border-gray-300 dark:border-gray-600 ${
                        errors.opdId ? "border-red-500 dark:border-red-500" : ""
                      }`}
                    >
                      <option value="">Pilih OPD</option>
                      {opds.map((opd) => (
                        <option key={opd.id} value={opd.id}>
                          {opd.name}
                        </option>
                      ))}
                    </Select>
                    {errors.opdId ? (
                      <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400">
                        <HiOutlineExclamationCircle className="mr-1 h-4 w-4" />
                        {errors.opdId}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Pilih instansi yang sesuai dengan laporan Anda
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 mb-4">
                <form className="space-y-5">
                  {/* Deskripsi */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="flex items-center text-gray-700 dark:text-gray-300">
                      <HiOutlineMail className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                      Deskripsi Laporan <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Jelaskan permasalahan yang Anda alami secara detail..."
                      rows={5}
                      value={formData.description}
                      onChange={handleChange}
                      required
                      className={`border-gray-300 dark:border-gray-600 ${
                        errors.description ? "border-red-500 dark:border-red-500" : ""
                      }`}
                    />
                    {errors.description ? (
                      <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400">
                        <HiOutlineExclamationCircle className="mr-1 h-4 w-4" />
                        {errors.description}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Berikan informasi selengkap mungkin termasuk lokasi, waktu kejadian, dan detail lainnya
                      </p>
                    )}
                  </div>

                  {/* Lokasi */}
                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center text-gray-700 dark:text-gray-300">
                      <HiOfficeBuilding className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                      Lokasi <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <TextInput
                      id="location"
                      name="location"
                      placeholder="Contoh: Jalan Ahmad Yani, Kelurahan Oesapa, Kecamatan Kelapa Lima"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className={`border-gray-300 dark:border-gray-600 ${
                        errors.location ? "border-red-500 dark:border-red-500" : ""
                      }`}
                    />
                    {errors.location && (
                      <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400">
                        <HiOutlineExclamationCircle className="mr-1 h-4 w-4" />
                        {errors.location}
                      </div>
                    )}
                  </div>

                  {/* Lampiran */}
                  <div className="space-y-2">
                    <Label htmlFor="files" className="flex items-center text-gray-700 dark:text-gray-300">
                      <HiOutlinePhotograph className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                      Lampiran (Opsional)
                    </Label>
                    <FileInput
                      id="files"
                      multiple
                      onChange={handleFileChange}
                      helperText="Upload foto atau dokumen pendukung (maks. 5MB per file)"
                      accept="image/*, application/pdf"
                      className="border-gray-300 dark:border-gray-600"
                    />
                    {files.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{files.length} file dipilih</p>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                    <HiPaperAirplane className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-white">Konfirmasi Laporan</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      Periksa kembali laporan Anda sebelum dikirim
                    </p>
                  </div>
                </div>

                <div className="space-y-4 bg-blue-50 dark:bg-gray-800 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Judul Laporan:</p>
                      <p className="text-gray-900 dark:text-white">{formData.title}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Kategori:</p>
                      <p className="text-gray-900 dark:text-white">
                        {formData.category === "INFRASTRUKTUR" && "Infrastruktur"}
                        {formData.category === "PELAYANAN" && "Pelayanan Publik"}
                        {formData.category === "SOSIAL" && "Permasalahan Sosial"}
                        {formData.category === "LAINNYA" && "Lainnya"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Prioritas:</p>
                      <p className="text-gray-900 dark:text-white">
                        {formData.priority === "LOW" && "Rendah"}
                        {formData.priority === "MEDIUM" && "Sedang"}
                        {formData.priority === "HIGH" && "Tinggi"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">OPD Tujuan:</p>
                      <p className="text-gray-900 dark:text-white">
                        {opds.find((opd) => opd.id === formData.opdId)?.name || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Lokasi:</p>
                      <p className="text-gray-900 dark:text-white">{formData.location}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Deskripsi:</p>
                    <p className="text-gray-900 dark:text-white whitespace-pre-line">{formData.description}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Lampiran:</p>
                    {files.length > 0 ? (
                      <ul className="list-disc list-inside text-gray-900 dark:text-white">
                        {files.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">Tidak ada lampiran</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 flex items-start">
                    <HiOutlineExclamationCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      Dengan mengirim laporan ini, Anda menyatakan bahwa informasi yang diberikan adalah benar dan dapat
                      dipertanggungjawabkan.
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal.Body>

      <Modal.Footer className="flex justify-between">
        {step > 1 ? (
          <Button color="light" onClick={prevStep} disabled={isSubmitting}>
            Kembali
          </Button>
        ) : (
          <Button color="light" onClick={handleCloseModal} disabled={isSubmitting}>
            Batal
          </Button>
        )}

        {step < 3 ? (
          <Button color="blue" onClick={nextStep}>
            Lanjutkan
          </Button>
        ) : (
          <Button
            gradientDuoTone="blueToCyan"
            onClick={handleSubmit}
            isProcessing={isSubmitting}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <HiPaperAirplane className="h-5 w-5" />
            {isSubmitting ? "Mengirim..." : "Kirim Laporan"}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export default ReportModal
