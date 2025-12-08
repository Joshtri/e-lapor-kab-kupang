# Sistem Kategori Dinamis - E-Lapor Kab Kupang

## Overview

Sistem kategori pengaduan telah diubah dari hardcoded menjadi dinamis dengan database. Sekarang admin dapat mengelola kategori dan subkategori melalui halaman admin.

## Perubahan yang Dilakukan

### 1. Database Schema
Ditambahkan 2 model baru di Prisma:
- **Category**: Menyimpan kategori utama
  - `id`: Primary key (auto-generated)
  - `name`: Nama kategori
  - `isActive`: Status aktif/nonaktif
  - `createdAt`, `updatedAt`: Timestamp

- **Subcategory**: Menyimpan subkategori
  - `id`: Primary key (auto-generated)
  - `categoryId`: Foreign key ke Category
  - `name`: Nama subkategori
  - `isActive`: Status aktif/nonaktif
  - `createdAt`, `updatedAt`: Timestamp

### 2. API Endpoints

#### Categories
- `GET /api/categories` - Fetch semua kategori (dengan query param `activeOnly=true` untuk filter)
- `POST /api/categories` - Create kategori baru
- `GET /api/categories/[id]` - Fetch kategori by ID
- `PUT /api/categories/[id]` - Update kategori
- `DELETE /api/categories/[id]` - Delete kategori (cascade delete subcategories)

#### Subcategories
- `GET /api/subcategories` - Fetch semua subkategori (dengan query param `categoryId` dan `activeOnly`)
- `POST /api/subcategories` - Create subkategori baru
- `GET /api/subcategories/[id]` - Fetch subkategori by ID
- `PUT /api/subcategories/[id]` - Update subkategori
- `DELETE /api/subcategories/[id]` - Delete subkategori

### 3. Halaman Admin
Halaman baru di `/adm/categories` untuk mengelola kategori dan subkategori dengan fitur:
- ✅ CRUD kategori dan subkategori
- ✅ Toggle status aktif/nonaktif
- ✅ Expandable rows untuk melihat subcategories
- ✅ Konfirmasi sebelum delete
- ✅ Validasi duplikasi nama

### 4. Form Pengaduan (Step1.jsx)
Diubah untuk fetch data dinamis dari API:
- Menggunakan custom hooks `useCategories()` dan `useSubcategories()`
- Loading state saat fetch data
- Hanya menampilkan kategori/subkategori yang aktif

## Cara Setup

### 1. Jalankan Migration
```bash
npx prisma migrate dev --name add_category_subcategory_models
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Seed Data Kategori
Untuk mengisi database dengan data kategori yang sudah ada:
```bash
npm run seed:categories
```

Script ini akan:
- Menghapus semua kategori dan subkategori yang ada
- Mengisi database dengan 16 kategori dan 100+ subkategori
- Semua data akan di-set sebagai aktif (isActive = true)

## Cara Menggunakan

### Untuk Admin

1. **Akses Halaman Kategori**
   - Login sebagai admin
   - Navigasi ke `/adm/categories`

2. **Menambah Kategori**
   - Klik tombol "Tambah Kategori"
   - Isi nama kategori
   - Set status aktif/nonaktif
   - Klik "Simpan"

3. **Menambah Subkategori**
   - Klik tombol hijau (+) pada kategori yang diinginkan
   - Isi nama subkategori
   - Set status aktif/nonaktif
   - Klik "Simpan"

4. **Edit Kategori/Subkategori**
   - Klik tombol kuning (pensil) pada item yang ingin diedit
   - Ubah data yang diperlukan
   - Klik "Simpan"

5. **Hapus Kategori/Subkategori**
   - Klik tombol merah (trash) pada item yang ingin dihapus
   - Konfirmasi penghapusan
   - **Catatan**: Menghapus kategori akan otomatis menghapus semua subkategorinya

6. **Nonaktifkan Kategori/Subkategori**
   - Edit kategori/subkategori
   - Toggle switch "Status Aktif" menjadi off
   - Kategori/subkategori yang nonaktif tidak akan muncul di form pengaduan

### Untuk Pelapor

Tidak ada perubahan dari sisi user experience:
- Form pengaduan tetap sama
- Dropdown kategori dan subkategori akan otomatis terisi dari database
- Hanya kategori/subkategori yang aktif yang akan ditampilkan

## File yang Diubah/Ditambahkan

### Database & Migration
- `prisma/schema.prisma` - Ditambah model Category dan Subcategory
- `prisma/migrations/[timestamp]_add_category_subcategory_models/` - Migration files
- `prisma/seedCategories.js` - Script untuk seed data kategori

### API Routes
- `app/api/categories/route.js` - API untuk list & create kategori
- `app/api/categories/[id]/route.js` - API untuk get, update, delete kategori
- `app/api/subcategories/route.js` - API untuk list & create subkategori
- `app/api/subcategories/[id]/route.js` - API untuk get, update, delete subkategori

### Admin Pages
- `app/(admin)/adm/categories/page.jsx` - Halaman admin untuk kelola kategori

### Features
- `features/pengaduan/pelapor/create/Step1.jsx` - Diubah untuk fetch data dinamis
- `features/pengaduan/pelapor/create/hooks.js` - Custom hooks untuk fetch data

### Utils
- `utils/reportCategories.js` - **DEPRECATED** (tidak digunakan lagi, tapi tidak dihapus untuk backward compatibility)

## Keuntungan Sistem Baru

1. **Fleksibilitas**: Admin dapat menambah/edit/hapus kategori tanpa perlu deploy ulang
2. **Kontrol**: Field `isActive` memungkinkan admin untuk menyembunyikan kategori tanpa menghapusnya
3. **Skalabilitas**: Mudah untuk menambah kategori baru sesuai kebutuhan
4. **Konsistensi**: Data kategori tersimpan di database, tidak hardcoded
5. **Audit Trail**: Timestamp `createdAt` dan `updatedAt` untuk tracking

## Troubleshooting

### Migration Gagal
Jika migration gagal, coba:
```bash
npx prisma migrate reset
npm run seed:categories
```

### Data Kategori Tidak Muncul
1. Pastikan migration sudah dijalankan
2. Pastikan seeder sudah dijalankan
3. Cek apakah kategori di-set sebagai aktif (isActive = true)
4. Cek console browser untuk error API

### Error saat Seed
Jika error saat menjalankan seeder:
```bash
# Pastikan Prisma Client sudah di-generate
npx prisma generate

# Jalankan ulang seeder
npm run seed:categories
```

## Catatan Penting

⚠️ **Backup Database**: Sebelum menjalankan migration di production, pastikan backup database terlebih dahulu

⚠️ **Data Lama**: Jika ada laporan yang sudah menggunakan kategori hardcoded, pastikan untuk migrasi data tersebut ke format baru

⚠️ **Cascade Delete**: Menghapus kategori akan otomatis menghapus semua subkategorinya. Gunakan dengan hati-hati!

## Future Improvements

- [ ] Bulk import kategori dari Excel/CSV
- [ ] Export kategori ke Excel/CSV
- [ ] Reorder kategori (drag & drop)
- [ ] Kategori icon/color customization
- [ ] Statistik penggunaan per kategori
