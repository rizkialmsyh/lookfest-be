import { Gender } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, IsStrongPassword } from 'class-validator';

export class RegisterInputDto {
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'The email address of the user',
  })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description: 'The password for the user. Must be strong.',
  })
  @IsString()
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @IsString()
  fullname: string;

  @ApiProperty({
    example: 'Johnny',
    description: 'Nickname of the user',
  })
  @IsString()
  nickname: string;

  @ApiProperty({
    example: 'male',
    description: 'Gender of the user',
    enum: Gender,
  })
  @IsEnum(Gender, { message: 'Gender must be either male or female' })
  gender: Gender;

  @ApiProperty({
    example: '+6281234567890',
    // description: 'Phone number of the user in valid Indonesian format',
  })

  // @IsPhoneNumber('ID', {
  //   message: 'Phone number must be a valid Indonesian number',
  // })
  // @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: '123 Main Street, Jakarta, Indonesia',
    description: 'Address of the user',
    required: false,
  })
  @IsString()
  address: string;
}
