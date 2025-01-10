import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsUUID,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Category ID of the product' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ description: 'Name of the product' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the product' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Price of the product' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Stock of the product', default: 0 })
  @IsNumber()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    description: 'Array of images to upload',
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  @IsArray()
  images: Express.Multer.File[];
}
