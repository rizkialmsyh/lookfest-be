# Gunakan base image Node.js versi 18
FROM node:18

# Tentukan working directory di dalam container
WORKDIR /usr/src/app

# Salin file package.json dan package-lock.json ke working directory
COPY package*.json ./

# Instal dependencies aplikasi
RUN npm install

# Salin seluruh kode aplikasi dari direktori lokal ke working directory di dalam container
COPY . .

# Generate Prisma Client untuk database interaction
RUN npx prisma generate

# Build aplikasi untuk production
RUN npm run build

# Expose port aplikasi yang digunakan (NestJS biasanya menggunakan port 3000)
EXPOSE 3000

# Jalankan migrasi Prisma saat container dimulai, lalu jalankan aplikasi
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]

