import { ApiProperty } from '@nestjs/swagger';

export class WebhookDto {
  @ApiProperty({
    description: 'The unique order ID of the transaction',
    example: 'ORDER-1657293000000',
  })
  order_id: string;

  @ApiProperty({
    description: 'The current status of the transaction',
    example: 'settlement',
  })
  transaction_status: string;
}
