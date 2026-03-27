# EventKu App

Aplikasi Informasi Kegiatan dan Manajemen Pendaftaran Peserta berbasis React.js. 

Terintegrasi penuh dengan sinkronisasi **Firebase Realtime Database** untuk pembaruan *live* instan antarpengguna tanpa perlu memuat ulang (*refresh*) halaman web, serta dikemas dalam UI *glassmorphism* modern dengan transisi layar penuh elegan.

## Fitur Utama

- **Informasi Kegiatan Publik**: Tampilan grid kartu event 3-kolom modern dengan label perhitungan waktu mundur interaktif (*countdown*).
- **Pengaturan Acara Waktu-Nyata**: Menambah, mengedit, atau menghapus daftar kegiatan dengan pembaruan layar yang memantul langsung ke segala jendela perangkat pengunjung (*EventSource SSE*).
- **Manajemen Peserta Dinamis**: Sistem pendaftaran nama dan nomor yang langsung terhubung ke tabel data tiap kegiatan, lengkap dengan proteksi keamanan sensor nomor HP.
- **Arsip Otomatis**: Acara yang telah berakhir otomatis dimasukkan ke bagian *Arsip* oleh sistem sinkronisasi.

## Menjalankan Aplikasi

Pastikan NodeJS terpasang, lalu masukkan perintah ini di *terminal* kode Anda:

```bash
# 1. Unduh library / dependency yang dibutuhkan
npm install

# 2. Nyalakan aplikasinya
npm run dev
```

Aplikasi siap dibuka di `http://localhost:5173/`.
