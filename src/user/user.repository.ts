import { Injectable } from '@nestjs/common';
import { Gender, Role } from '@prisma/client';
import { PrismaService } from 'src/libs/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(
    page: number,
    limit: number,
    name?: string,
    email?: string,
  ) {
    const skip = (page - 1) * limit;
    const take = Number(limit);

    const whereCondition: any = {};
  
    if (name) {
      whereCondition.profiles = {
        some: {
          fullname: {
            contains: name,
            mode: 'insensitive',
          },
        },
      };
    }
  
    if (email) {
      whereCondition.email = {
        contains: email,
        mode: 'insensitive',
      };
    }
  
    const users = await this.prisma.user.findMany({
      where: {
        ...whereCondition,
        isEmailVerified: true,
      },
      skip,
      take,
      include: {
        profiles: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalCount = await this.prisma.user.count({
      where: {
        ...whereCondition,
        isEmailVerified: true,
      },
    });
  
    const totalPages = Math.ceil(totalCount / limit);

    return {
      users,
      totalPages,
      totalCount,
      message: users.length === 0 ? 'No users found matching the criteria.' : undefined,
    };
  }  

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        profiles: true,
      },
    });
  }

  async createUser(
    email: string,
    hashedPassword: string,
    fullname: string,
    nickname: string,
    gender: Gender,
    phone: string,
    address: string,
    role: Role,
  ) {
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        isEmailVerified: false,
        role,
      },
    });

    await this.prisma.profile.create({
      data: {
        userId: user.id,
        fullname,
        nickname,
        gender,
        phone,
        address,
      },
    });

    return user;
  }

  async verifyEmail(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isEmailVerified: true },
    });
  }

  async findUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profiles: true,
      },
    });
  }

  async updatePassword(userId: string, hashedPassword: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async updateRoleUser(userId: string, role: Role) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  async getTransactionsByUser(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const take = parseInt(limit.toString(), 10);
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where: { userId },
        skip,
        take,
        include: {
          product: true,
        },
      }),
      this.prisma.transaction.count({ where: { userId } }),
    ]);

    return { transactions, total };
  }
}
