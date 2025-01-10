import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterInputDto } from './dto/register.input.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login.response.dto';
import { LoginDto } from './dto/login.input.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiBody({
    type: RegisterInputDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Registration successful, OTP sent to email',
    schema: {
      example: {
        message: 'Registration successful, OTP sent to email',
      },
    },
  })
  async register(@Body() registerDto: RegisterInputDto) {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      if (error.message === 'Email already exists') {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  @Post('verify-otp')
  @ApiBody({
    schema: {
      example: {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        otp: '123456',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Email verification successful',
    schema: {
      example: {
        message: 'Email verification successful',
      },
    },
  })
  async verifyOtp(@Body('userId') userId: string, @Body('otp') otp: string) {
    try {
      return await this.authService.verifyOtp(userId, otp);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('resend-otp')
  @ApiBody({
    schema: {
      example: {
        userId: '123e4567-e89b-12d3-a456-426614174000',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'OTP resent successfully',
    schema: {
      example: {
        message: 'OTP resent successfully',
      },
    },
  })
  async resendOtp(@Body('userId') userId: string) {
    try {
      return await this.authService.resendOtp(userId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  @ApiBody({
    type: LoginDto,
    examples: {
      Member: {
        summary: 'Login as User',
        value: {
          email: 'user@example.com',
          password: 'User12345!',
        },
      },
      Admin: {
        summary: 'Login as Admin',
        value: {
          email: 'admin@example.com',
          password: 'Admin12345!',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials or email not verified',
  })
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ message: string } | LoginResponseDto> {
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      if (
        error.message === 'Invalid credentials' ||
        error.message === 'Email not verified'
      ) {
        return { message: error.message };
      }
      return { message: 'An unexpected error occurred' };
    }
  }
}
