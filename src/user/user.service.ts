import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/changePassword.input.dto';
import { UserProfileResponseDto } from './dto/user.profile.response.dto';
import { UserListResponseDto, UserResponseDto } from './dto/user.response.dto';
import { Role } from '@prisma/client';
// import { TransactionResponseDto } from './dto/transaction.response.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUser( page: number, limit: number, name?: string, email?: string ): Promise<UserListResponseDto> {
    const { users, totalCount, totalPages, message } = await this.userRepository.getAllUsers(
      page, 
      limit,
      name,
      email,
    );

    if (!users || users.length === 0) {
      return { 
        message: message || 'No users found',
        users: [],
        pagination: {
          currentPage: page.toString(),
          totalPages: 0,
          totalCount: 0,
          limit: limit.toString(),
        },
      };
    }

    const listUser = users.map((user) => {
      const profile = user.profiles?.[0] || { fullname: 'N/A' };
      return {
        id: user.id,
        email: user.email,
        fullname: profile.fullname,
        role: user.role,
      };
    });

    return { 
      message: 'success get all user',
      users: listUser,
      pagination: {
        currentPage: page.toString(),
        totalPages,
        totalCount: totalCount,
        limit: limit.toString(),
      },
    };
  }

  async getUserProfileByToken(userId: string): Promise<UserProfileResponseDto> {
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const profile = user.profiles[0];

    if (!profile) {
      throw new UnauthorizedException('Profile not found');
    }

    return {
      message: 'success get profile',
      id: user.id,
      email: user.email,
      role: user.role,
      fullname: profile.fullname,
      nickname: profile.nickname,
      gender: profile.gender,
      phone: profile.phone,
      address: profile.address,
    };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { oldPassword, newPassword } = changePasswordDto;

    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.updatePassword(userId, hashedNewPassword);
    return { message: 'Password successfully changed' };
  }

  async updateRole(userId: string, role: string) {
    if (!userId) {
      throw new BadRequestException('Please input user id');
    }

    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const roleAdmin = user.role;
    if (roleAdmin === 'admin') {
      throw new BadRequestException("Can't change role admin");
    }

    await this.userRepository.updateRoleUser(userId, role as Role);
    return { message: 'Role updated successfully' };
  }

  async getTransactionsByUser(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const { transactions, total } =
      await this.userRepository.getTransactionsByUser(userId, page, limit);

    const meta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    const data = transactions.map((transaction) => ({
      id: transaction.id,
      productId: transaction.productId,
      totalAmount: transaction.totalAmount.toString(),
      status: transaction.status,
      paymentMethod: transaction.paymentMethod,
      paymentUrl: transaction.paymentUrl,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      productName: transaction.product.name,
    }));

    return { data, meta };
  }
}
