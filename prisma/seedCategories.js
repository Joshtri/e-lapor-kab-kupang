const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const reportCategories = [
    {
        text: 'Agama',
        sub: [
            { text: 'Haji dan Umroh' },
            { text: 'Lainnya terkait Agama' },
            { text: 'Pendidikan Agama' },
            { text: 'Penyediaan Fasilitas Ibadah' },
        ],
    },
    {
        text: 'Corona Virus',
        sub: [
            { text: 'Alat Rapid Test' },
            { text: 'APD' },
            { text: 'Disinfektan, masker, dll' },
            { text: 'PCR Kit' },
            { text: 'Ventilator' },
        ],
    },
    {
        text: 'Ekonomi dan Keuangan',
        sub: [
            { text: 'Anggaran dan Perbendaharaan' },
            { text: 'Bea dan Cukai' },
            { text: 'Jasa Keuangan' },
            { text: 'Kawasan Ekonomi Khusus' },
            { text: 'Kekayaan Negara dan Lelang' },
        ],
    },
    {
        text: 'Kesehatan',
        sub: [
            { text: 'Bantuan Biaya Pendidikan' },
            { text: 'Gizi Buruk/Stunting' },
            { text: 'Jaminan Sosial Kesehatan' },
            { text: 'Lainnya terkait Kesehatan' },
            { text: 'Masalah Disiplin Profesi' },
            { text: 'Masalah Kesejahteraan' },
            { text: 'Masalah penempatan/penugasan' },
            { text: 'Masalah perlindungan hukum' },
            { text: 'Pelayanan Kesehatan' },
            { text: 'Pelayanan Obat' },
            { text: 'Pendayagunaan Tenaga Medis dan Tenaga Kesehatan' },
            { text: 'Perizinan dan Pengawasan Layanan Kesehatan' },
            { text: 'Tenaga Medis/STR' },
        ],
    },

    {
        text: 'Perlindungan Konsumen',
        sub: [
            { text: 'Perlindungan Konsumen terkait Barang Elektronik, Telematika, dan Kendaraan Bermotor' },
            { text: 'Perlindungan Konsumen terkait Jasa Keuangan' },
            { text: 'Perlindungan Konsumen terkait Jasa Layanan Kesehatan' },
            { text: 'Perlindungan Konsumen terkait Jasa Logistik' },
            { text: 'Perlindungan Konsumen terkait Jasa Pariwisata' },
            { text: 'Perlindungan Konsumen terkait Jasa Telekomunikasi' },
            { text: 'Perlindungan Konsumen terkait Jasa Transportasi' },


            { text: 'Perlindungan Konsumen terkait Listrik dan Gas Rumah Tangga' },
            { text: 'Perlindungan Konsumen terkait Obat dan Makanan' },
            { text: 'Perlindungan Konsumen terkait Perumahan' },
            { text: 'Perlindungan Konsumen terkait Transaksi Perdagangan melalui Sistem Elektronik (E-commerce)' },

        ]
    },

    {
        text: 'Teknologi Informasi dan Komunikasi',
        sub: [
            { text: ' Blokir Nomor Telepon' },
            { text: 'Blokir Website' },
            { text: 'Konten Penipuan' },
            { text: 'Konten Pornografi' },
            { text: 'Laiinya terkait Blokir Website' },
            { text: 'Perjudian online' },
            { text: 'Phising/ Pengelabuhan' },
            { text: 'CSIRT' },
        ],
    },

    {
        text: 'Program Makan Bergizi Gratis (MBG)',
        sub: [
            { text: 'Distribusi & Penyaluran MBG Kemitraan MBG' },
            { text: 'Koordinasi dan Sosialisasi MBG' },
            { text: 'Kualitas Makanan MBG' },
            { text: 'Pelaksanaan MBG di Sekolah' },
            { text: 'Pengawasan dan Evaluasi' },
        ]
    },

    {
        text: 'Seleksi Calon Hakim Agung RI',

    },
    {
        text: 'SRGI',

    },
    {
        text: 'Pendidikan dan Kebudayaan',
        sub: [
            { text: 'Balai Diklat' },
            { text: 'Kartu Indonesia Pintar/KIP' },
            { text: 'Kebudayaan' },
            { text: 'Lainnya terkait Pendidikan dan Kebudayaan' },
            { text: 'Paud dan Pendidikan Informal' },
            { text: 'Pendidikan Dasar dan Menengah' },
            { text: 'Pendidikan Tinggi' },
            { text: 'Politeknik' },
        ],
    },

    {
        text: 'Layanan Air Minum',
        sub: [
            { text: 'Biaya/Tarif PDAM' },
            { text: 'Gangguan Layanan Penyaluran Air' },
            { text: 'Lainnya terkait Layanan Air Minum' }
        ]
    },
    {
        text: 'Kependudukan',
        sub: [
            { text: 'Administrasi Kependudukan dan Pencatatan Sipil' },
            { text: 'Administrasi Kewilayahan' },
            { text: 'Lainnya terkait Kependudukan' },
            { text: 'Pengendalian Penduduk dan Keluarga Berencana' },
            { text: 'Pernikahan' },
            { text: 'Sensus Penduduk' },
        ],
    },
    {
        text: 'Pembangunan Desa, Daerah Tertinggal, dan Transmigrasi',
        sub: [
            {
                text: 'Lainnya terkait Pembangunan Desa, Daerah Tertinggal, dan Transmigrasi',
            },
            { text: 'Pembangunan Desa dan Daerah Tertinggal' },
            { text: 'Transmigrasi' },
        ],
    },
    {
        text: 'Pertanian dan Peternakan',
        sub: [
            { text: 'Bantuan Pertanian' },
            { text: 'Bibit Pertanian' },
            { text: 'Gabungan Kelompok Tani' },
            { text: 'Irigasi Pertanian' },
            { text: 'Lainnya terkait Pertanian dan Peternakan' },
            { text: 'Penanggulangan Bencana Pertanian' },
            { text: 'Pengembangan Sarana Pertanian' },
            { text: 'Peternakan' },
            { text: 'Pupuk' },
        ],
    },
    {
        text: 'Politik dan Hukum',
        sub: [
            { text: 'Administrasi Hukum Umum (AHU) Online' },
            { text: 'BPHN' },
            { text: 'Hak Asasi Manusia (HAM)' },
            { text: 'Hukum' },
            { text: 'Imigrasi' },
            { text: 'Kekayaan Intelektual' },
            { text: 'Kewaspadaan Nasional' },
            { text: 'Korupsi, Kolusi, dan Nepotisme' },
            { text: 'Lainnya terkait Politik dan Hukum' },
            { text: 'Pemilihan Kepala Desa/Pilkades' },
            { text: 'Pemilihan Umum' },
            { text: 'Pengadilan Negeri dan Pengadilan Agama' },
            { text: 'Peraturan Perundang-undangan' },
            { text: 'Permasyarakatan' },
        ],
    },
    {
        text: 'Sosial dan Kesejahteraan',
        sub: [
            { text: 'Bantuan Sosial' },
            { text: 'Lainnya terkait Sosial dan Kesejahteraan' },
            { text: 'Pangan' },
            { text: 'Pemberdayaan Masyarakat' },
        ],
    },
    {
        text: 'Pertambangan',
        sub: [
            { text: 'Dampak Lingkungan Area Pertambangan' },
            { text: 'Izin Pertambangan' },
            { text: 'Kecelakaan Pertambangan' },
            { text: 'Lahan Pertambangan' },
            { text: 'Lainnya terkait Pertambangan' },
        ],
    },

    {
        text: 'Kekerasan di satuan Pendidikan ( Sekolah, Kampus, Lembaga Kursus',
        sub: [
            { text: 'Intoleransi dan Kekerasan Seksual' },
            { text: 'Kekerasan Seksual, Perundungan, dan Intoleransi' },
            { text: 'Lainnya' },
            { text: 'Perundungan dan Intoleransi' },
            { text: 'Perundungan dan Kekerasan Seksual' },
            { text: 'Intoleransi' },
            { text: 'Kekerasan Seksual' },
            { text: 'Perundungan (Bullying)' },
        ]
    },
    {
        text: 'Ketenagakerjaan',
        sub: [
            { text: 'Hak Pekerja' },
            { text: 'Jaminan Sosial Ketenagakerjaan' },
            { text: 'Kepegawaian' },
            { text: 'Keselamatan Pekerja' },
            { text: 'Lainnya terkait Ketenagakerjaan' },
            { text: 'Rekrutmen Tenagakerja' },
            { text: 'Tenaga Kerja Asing (TKA)' },
            {
                text: 'Tenaga Kerja Indonesia/ Pekerja Migran Indonesia (TKI/MI)',
            },
        ],
    },
    {
        text: 'Pekerjaan Umum dan Penataan Ruang',
        sub: [
            { text: 'Bendungan' },
            { text: 'Drainase (Gorong-Gorong/Parit)' },
            { text: 'Infrastruktur Jalan' },
            { text: 'Infrastruktur Pendukung' },
            { text: 'Lainnya terkait Pekerjaan Umum dan Penataan Ruang' },
            { text: 'Pasar' },
            { text: 'Permukiman' },
            { text: 'Pertanahan' },
            { text: 'Perumahan Bersubsidi dan Rumah Susun' },
        ],
    },
    {
        text: 'Perhubungan',
        sub: [
            { text: 'Lainnya terkait Perhubungan' },
            { text: 'Perkeretaapian' },
            { text: 'Transportasi Darat' },
            { text: 'Transportasi Laut' },
            { text: 'Transportasi Online' },
            { text: 'Transportasi Udara' },
            { text: 'Lampu Penerangan Jalan' },
            { text: 'Pembangunan Jembatan' },
            { text: 'Parkir Liar' },
        ],
    },
    {
        text: 'Lingkungan Hidup dan Kehutanan',
        sub: [
            { text: 'Kehutanan' },
            { text: 'Kelautan dan Perikanan' },
            { text: 'Lainnya terkait Lingkungan Hidup dan Kehutanan' },
            { text: 'Penanggulangan Bencana' },
            { text: 'Pencemaran Lingkungan' },
            { text: 'Penebangan Liar (Ilegal Logging)' },
            { text: 'Perlindungan Flora' },
            { text: 'Perlindungan Satwa' },
        ],
    },
    {
        text: 'Ketenteraman, Ketertiban Umum, dan Pelindungan Masyarakat',
        sub: [
            { text: 'Kepolisian' },
            { text: 'Ketertiban Umum' },
            {
                text: 'Lainnya terkait Ketenteraman, Ketertiban Umum, dan Pelindungan Masyarakat',
            },
            { text: 'Pemadaman Kebakaran' },
            { text: 'Radikalisme' },
            { text: 'SARA' },
        ],
    },
    {
        text: 'Kesetaraan Gender dan Sosial Inklusif',
        sub: [
            { text: 'Akses Masyarakat Berkebutuhan Khusus/ Disabilitas' },
            { text: 'Anak Terlantar' },
            { text: 'Eksploitasi Anak' },
            { text: 'Kekerasan dalam rumah tangga' },
            { text: 'Kesetaraan Gender' },
            {
                text: 'Lainnya terkait Kesetaraan Gender dan Sosial Inklusif',
            },
            { text: 'Pelecehan Seksual' },
        ],
    },

    {
        text: 'Bantuan Sosial',
        sub: [
            { text: 'Jenis, mutu, dan harga bahan pangan' },
            { text: 'Kepesertaan' },
            { text: 'Mekanisme penyaluran' },
            { text: 'Merchant yang bekerja sama' },
            { text: 'Penyalahgunaan bantuan' },
            { text: 'Program' },
            { text: 'Saldo' },
        ]
    }
];

async function seedCategories() {
    console.log('🌱 Starting category seeding...');

    try {
        // Clear existing data
        console.log('🗑️  Clearing existing categories and subcategories...');
        await prisma.reportSubcategory.deleteMany({});
        await prisma.reportCategory.deleteMany({});

        let totalCategories = 0;
        let totalSubcategories = 0;

        for (const cat of reportCategories) {
            console.log(`\n📁 Creating category: ${cat.text}`);

            // Create category
            const category = await prisma.reportCategory.create({
                data: {
                    name: cat.text,
                    isActive: true,
                },
            });

            totalCategories++;

            // Create subcategories
            if (cat.sub && cat.sub.length > 0) {
                for (const sub of cat.sub) {
                    console.log(`  └─ Creating subcategory: ${sub.text}`);

                    await prisma.reportSubcategory.create({
                        data: {
                            categoryId: category.id,
                            name: sub.text,
                            isActive: true,
                        },
                    });

                    totalSubcategories++;
                }
            }
        }

        console.log('\n✅ Seeding completed successfully!');
        console.log(`📊 Summary:`);
        console.log(`   - Categories created: ${totalCategories}`);
        console.log(`   - Subcategories created: ${totalSubcategories}`);
    } catch (error) {
        console.error('❌ Error seeding categories:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seedCategories()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
