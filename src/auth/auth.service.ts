import { Injectable } from '@nestjs/common';
import { RegisterInputDto } from './dto/register.input.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from 'src/libs/mail/mailer.service';
import { OTPService } from 'src/libs/mail/otp.service';
import { UserRepository } from '../user/user.repository';
import { getEmailTemplate } from 'src/libs/mail/email-template.helper';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.input.dto';
import { LoginResponseDto } from './dto/login.response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailerService: MailerService,
    private readonly otpService: OTPService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterInputDto) {
    const { email, password, fullname, nickname, gender, phone, address } =
      registerDto;

    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.createUser(
      email,
      hashedPassword,
      fullname,
      nickname,
      gender,
      phone,
      address,
      'user',
    );

    const otp = await this.otpService.generateOtp(user.id);

    await this.mailerService.sendEmail({
      to: email,
      subject: 'Email Verification',
      html: getEmailTemplate(otp),
    });

    return {
      message: 'Registration successful, OTP sent to email',
      userId: user.id,
    };
  }

  async verifyOtp(userId: string, otp: string) {
    const user = await this.userRepository.findUserById(userId);
    const isOtpValid = await this.otpService.validateOtp(userId, otp);

    if (!user) {
      throw new Error('User not found');
    }

    if (!isOtpValid) {
      throw new Error('Invalid OTP');
    }

    await this.userRepository.verifyEmail(userId);

    return { message: 'Email verification successful' };
  }

  async resendOtp(userId: string) {
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const otp = await this.otpService.generateOtp(userId);

    await this.mailerService.sendEmail({
      to: user.email,
      subject: 'Email Verification',
      html: getEmailTemplate(otp),
    });

    return { message: 'OTP resent successfully' };
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new Error('Email not verified');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    const userData = {
      id: user.id,
      role: user.role,
      email: user.email,
      nickname: user.profiles?.[0]?.nickname,
      fullname: user.profiles?.[0]?.fullname,
    };

    return {
      message: 'Login successful',
      token,
      user: userData,
    };
  }
}
