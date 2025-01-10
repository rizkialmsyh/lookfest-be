import { IsString, IsOptional, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({
    example: 'Electronics',
    description: 'The category ID of the product',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiProperty({
    example: 'Updated Smartphone',
    description: 'The updated name of the product',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Updated description for the latest model',
    description: 'The updated description of the product',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 799,
    description: 'The updated price of the product',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    example: 80,
    description: 'The updated stock of the product',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  stock?: number;
}
