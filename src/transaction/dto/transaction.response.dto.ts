import { ApiProperty } from '@nestjs/swagger';

export class TransactionResponseDto {
  @ApiProperty({ example: '3518672b-27b1-4888-bc12-598bf663334f' })
  id: string;

  @ApiProperty({ example: '0027c997-1174-440d-9377-dbfaa6b1d6eb' })
  userId: string;

  @ApiProperty({ example: '2a877f84-8a8a-47aa-930f-9c421e559136' })
  productId: string;

  @ApiProperty({ example: '799' })
  totalAmount: string;

  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ example: 'Bank Transfer', nullable: true })
  paymentMethod: string | null;

  @ApiProperty({
    example:
      'https://app.sandbox.midtrans.com/snap/v4/redirection/1f148bb1-f65f-4f88-9436-02d738471af3',
  })
  paymentUrl: string;

  @ApiProperty({ example: '2025-01-01T07:35:42.491Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-01-01T07:35:56.604Z' })
  updatedAt: string;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 9 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;
}

export class GetAllTransactionsResponseDto {
  @ApiProperty({ example: 'Transactions get all successfully' })
  message: string;

  @ApiProperty({ type: [TransactionResponseDto] })
  transactions: TransactionResponseDto[];

  @ApiProperty()
  meta: PaginationMetaDto;
}

export class ApiResponseDto {
  @ApiProperty({ example: 'Transactions fetched successfully' })
  message: string;

  @ApiProperty()
  data: GetAllTransactionsResponseDto;
}
