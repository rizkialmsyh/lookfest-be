import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'The ID of the product to be purchased',
    example: '1c118cf3-73b2-4649-b7e5-9e5bc2ecdf30',
  })
  productId: string;

  @ApiProperty({
    description: 'The ID of the product to be purchased',
    example: '1',
  })
  quantity: number;
}
