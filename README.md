
# Virtual Tour - Instalasi Cepat

Panduan singkat untuk instalasi dan setup awal aplikasi Virtual Tour berbasis Laravel 12.

---

## Persyaratan

- PHP >= 8.4
- Composer
- Node.js & npm
- Database (MySQL, PostgreSQL, dll)

---

## Langkah Instalasi

1. **Clone repository**

   ```bash
   git clone https://github.com/RahmatRafiq/virtual-tour.git
   cd virtual-tour
   ```

2. **Install dependensi PHP**

   ```bash
   composer install
   ```

3. **Install dependensi Node**

   ```bash
   npm install
   ```

4. **Salin file environment & konfigurasi**

   ```bash
   cp .env.example .env
   # Edit .env sesuai database Anda
   ```

5. **Generate application key**

   ```bash
   php artisan key:generate
   ```

6. **Migrasi & seeder database (opsional)**

   ```bash
   php artisan migrate
   php artisan db:seed
   ```

7. **Jalankan server & compile asset**

   ```bash
   composer run dev
   ```

---

## Login Awal

Setelah instalasi dan seeder dijalankan, Anda dapat login menggunakan akun berikut:

- **Admin**
  - Email: `admin@example.com`
  - Password: `password`
- **User Biasa**
  - Email: `user@example.com`
  - Password: `password`

Selesai! Aplikasi siap dijalankan di http://localhost:8000

---

Lisensi: MIT
