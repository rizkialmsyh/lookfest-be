import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class DeleteMultipleProductImagesDto {
  @ApiProperty({ example: 'b5c43d47-d5d8-4f93-91b6-0b72ab5f94bc' })
  @IsUUID()
  productId: string;

  @ApiProperty({
    example: [
      'd4e17317-5f3d-4567-8e63-72b9d35ebd88',
      'a7c91457-3f2d-4f73-a93f-0a97ad9cf294',
    ],
  })
  @IsArray()
  @IsUUID('all', { each: true })
  productImageIds: string[];
}
