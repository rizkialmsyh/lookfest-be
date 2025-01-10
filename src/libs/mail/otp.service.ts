import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { addMinutes, isBefore } from 'date-fns';

@Injectable()
export class OTPService {
  constructor(private prisma: PrismaService) {}

  async generateOtp(userId: string) {
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = addMinutes(new Date(), 1);

    // Hapus OTP lama untuk userId ini
    await this.prisma.oTP.deleteMany({
      where: { userId },
    });

    // Simpan OTP baru ke database
    await this.prisma.oTP.create({
      data: {
        userId,
        otpCode,
        expiresAt,
      },
    });

    return otpCode;
  }

  async validateOtp(userId: string, otpCode: string): Promise<boolean> {
    // Ambil OTP berdasarkan userId dan otpCode
    const otpRecord = await this.prisma.oTP.findFirst({
      where: { userId, otpCode },
    });

    if (!otpRecord) {
      return false; // OTP tidak ditemukan
    }

    // Periksa apakah OTP sudah kedaluwarsa
    if (isBefore(new Date(otpRecord.expiresAt), new Date())) {
      await this.prisma.oTP.delete({ where: { id: otpRecord.id } }); // Hapus OTP yang sudah kedaluwarsa
      return false; // OTP sudah tidak berlaku
    }

    // Hapus OTP setelah berhasil divalidasi
    await this.prisma.oTP.delete({ where: { id: otpRecord.id } });

    return true; // OTP valid
  }
}
