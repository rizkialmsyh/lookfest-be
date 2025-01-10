import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { IsString, IsEnum } from 'class-validator';

export class UserResponseDto {
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
    description: 'User ID',
    example: '1234-5678-9012-3456',
  })
  @IsString()
  fullname: string;

  @ApiProperty({
    description: 'User role',
    example: 'admin',
  })
  @IsString()
  role: string;
}

export class ListUserResponseDto {
  @ApiProperty({ example: '1234-5678-9012-3456' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  fullname: string;

  @ApiProperty({ example: 'admin' })
  role: string;
}

export class PaginationResponse {
  @ApiProperty({ example: '1' })
  currentPage: string;

  @ApiProperty({ example: 5 })
  totalPages: number;

  @ApiProperty({ example: 50 })
  totalCount: number;

  @ApiProperty({ example: '10' })
  limit: string;
}

export class UserListResponseDto {
  @ApiProperty({
    description: 'Data of All user is found',
    example: 'Get All User Success',
  })
  message: string;

  @ApiProperty({
    description: 'Pagination',
    type: PaginationResponse,
  })
  pagination: PaginationResponse;

  @ApiProperty({
    description: 'List of user',
    type: [ListUserResponseDto],
    example: [
      {
        id: '1234-5678-9012-3456',
        email: 'user@example.com',
        fullname: 'John Doe',
        role: 'admin',
      },
    ],

  })
  users: ListUserResponseDto[];
}