import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UserProfileDto {
  @ApiProperty({ example: 'john' })
  nickname: string;

  @ApiProperty({ example: 'John Doe' })
  fullname: string;
}

export class UserDto {
  @ApiProperty({ example: 'user123' })
  id: string;

  profile: UserProfileDto[];
}

export class CategoryResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the category',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDI3Yzk5Ny0xMTc0LTQ0MGQtOTM3Ny1kYmZhYTZiMWQ2ZWIiLCJlbWFpbCI6Im11aGFtbWFkMjAwMDAxODQzMEB3ZWJtYWlsLnVhZC5hYy5pZCIsImlhdCI6MTczNTYyMDEwMSwiZXhwIjoxNzM1NzA2NTAxfQ.qryzRpOwqtZuqkFh-or_o43SafebxX4yJLQ212WSTNA',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'The name of the category',
    example: 'Technology',
  })
  @IsString()
  name: string;

  // @ApiProperty({
  //   description: 'The ID of the user who created the category',
  //   example: 'user123',
  // })
  // @IsString()
  // createdBy: string;

  @ApiProperty({
    description: 'The timestamp when the category was created',
    example: '2024-07-27T12:34:56Z',
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    description: 'The timestamp when the category was last updated',
    example: '2024-07-28T15:45:10Z',
  })
  @IsDateString()
  updatedAt: Date;

  @ApiProperty({
    description: 'The timestamp when the category was soft deleted (if any)',
    example: null,
    required: false,
  })
  @IsOptional()
  @IsDateString()
  deletedAt?: Date;

  @ApiProperty({
    description: 'The ID of the user who deleted the category (if any)',
    example: null,
    required: false,
  })
  @IsOptional()
  @IsString()
  deletedBy?: string;

  @ApiProperty({ type: UserProfileDto })
  createdByUser?: UserProfileDto;

  @ApiProperty({ type: UserProfileDto, required: false })
  deletedByUser?: UserProfileDto;
}

export class PaginationResponse {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 5 })
  totalPages: number;

  @ApiProperty({ example: 50 })
  totalCount: number;

  @ApiProperty({ example: 10 })
  limit: number;
}

export class CategoryListResponseDto {
  @ApiProperty({
    description: 'A message indicating the success of the operation',
    example: 'success get all categories',
  })
  message: string;

  @ApiProperty({
    description: 'List of categories',
    type: [CategoryResponseDto],
  })
  categories: CategoryResponseDto[];

  @ApiProperty({
    example: { currentPage: '1', totalPages: 5, totalCount: 50, limit: '10' },
  })
  pagination: PaginationResponse;
}
