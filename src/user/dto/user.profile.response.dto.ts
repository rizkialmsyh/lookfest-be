import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { IsString, IsEnum } from 'class-validator';

export class UserProfileResponseDto {
  @ApiProperty({
    description: 'Login success message',
    example: 'Login successful',
  })
  message: string;

  @ApiProperty({
    description: 'User ID',
    example: '1234-5678-9012-3456',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'User role',
    example: 'admin',
  })
  @IsString()
  role: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsString()
  fullname: string;

  @ApiProperty({
    description: 'Nickname of the user',
    example: 'johnny',
  })
  @IsString()
  nickname: string;

  @ApiProperty({
    description: 'Gender of the user',
    example: 'MALE',
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+1234567890',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Address of the user',
    example: '123 Main St, Springfield, IL',
  })
  @IsString()
  address: string;
}
