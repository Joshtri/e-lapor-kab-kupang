import { Card } from "flowbite-react";

const steps = [
  {
    number: 1,
    title: "Registrasi Online",
    description:
      "Pelapor melakukan registrasi online melalui website sebelum datang ke lokasi.",
  },
  {
    number: 2,
    title: "Pelapor Datang",
    description:
      "Pelapor datang ke lokasi pengaduan di Kantor Sekretariat Wakil Presiden.",
  },
  {
    number: 3,
    title: "Pengecekan Bukti Registrasi Online",
    description:
      "Petugas melakukan pengecekan bukti registrasi online pelapor.",
  },
  {
    number: 4,
    title: "Penukaran Kartu Identitas",
    description:
      "Pelapor menukarkan kartu identitas (KTP/SIM) untuk mendapatkan kartu ID Tamu.",
  },
  {
    number: 5,
    title: "Mengambil Antrian",
    description: "Pelapor mengambil nomor antrian di mesin antrian.",
  },
  {
    number: 6,
    title: "Meja Registrasi",
    description: "Pelapor menuju meja registrasi untuk verifikasi data.",
  },
  {
    number: 7,
    title: "Menunggu Antrian",
    description:
      "Pelapor menunggu di ruang tunggu hingga nomor antriannya dipanggil.",
  },
  {
    number: 8,
    title: "Ruang Pengaduan",
    description: "Pelapor memasuki ke Ruang Pengaduan sesuai nomor panggilan.",
  },
  {
    number: 9,
    title: "Menuju Loket sesuai Nomor Antrian",
    description:
      "Pelapor menuju loket yang sesuai dengan nomor panggilan di layar.",
  },
  {
    number: 10,
    title: "Proses Pelayanan Pengaduan",
    description:
      "Petugas melakukan layanan pengaduan dan mencatat laporan pada sistem.",
  },
  {
    number: 11,
    title: "Cetak Bukti Laporan",
    description: "Petugas memberikan lembar bukti laporan kepada pelapor.",
  },
  {
    number: 12,
    title: "Meninggalkan Ruang Pengaduan",
    description:
      "Pelapor meninggalkan ruang pengaduan dan mengambil kembali kartu identitas.",
  },
];

export default function AlurPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 mt-20">
        <Card>
          <h2 className="mb-6 text-center text-2xl font-bold">
            Alur Pengaduan Tatap Muka
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  {step.number}
                </div>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
