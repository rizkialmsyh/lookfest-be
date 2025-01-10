import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateProductImageDto {
  @ApiProperty({ example: 'b4e17317-5f3d-4567-8e63-72b9d35ebd88' })
  @IsUUID()
  productId: string;
}
