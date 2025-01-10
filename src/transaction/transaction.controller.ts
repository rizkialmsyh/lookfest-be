import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from 'src/libs/guards/jwt-auth.guard';
import { CreateTransactionDto } from './dto/create-transaction.input.dto';
import { WebhookDto } from './dto/update-status.input.dto';
import { RolesGuard } from 'src/libs/guards/roles.guard';
import { Roles } from '../libs/guards/roles.decorator';
import { ApiResponseDto } from './dto/transaction.response.dto';

@ApiTags('Transactions')
@Controller('v1/transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiBody({
    description: 'Product information to create transaction',
    type: CreateTransactionDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    schema: {
      example: {
        message: 'Transaction created successfully',
        data: { orderId: 'uuid', paymentUrl: 'https://midtrans.com/pay' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      example: { message: 'Product not found' },
    },
  })
  async createTransaction(
    @Req() req,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    const { productId, quantity } = createTransactionDto;
    const userId = req.user.sub;
    const result = await this.transactionService.createTransaction(
      userId,
      productId,
      quantity,
    );

    return { message: result.message, data: result.data || null };
  }

  @Post('update-status')
  @ApiBody({
    description: 'Webhook body from Midtrans',
    type: WebhookDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction status updated successfully',
    schema: {
      example: { message: 'Transaction status updated successfully' },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Transaction not found',
    schema: {
      example: { message: 'Transaction not found' },
    },
  })
  async webhook(@Body() body: any) {
    const { order_id, transaction_status, payment_type } = body;
    const result = await this.transactionService.updateTransactionStatus(
      order_id,
      transaction_status,
      payment_type,
    );
    return { message: result.message };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'limit',
    required: false,
    schema: { default: 10 },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    schema: { default: 1 },
  })
  @ApiResponse({
    status: 200,
    description: 'List of all transactions',
    type: ApiResponseDto,
  })
  async getAllTransactions(
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
  ) {
    let transactions;
    if (limit && page) {
      transactions = await this.transactionService.getAllTransactions(
        limit,
        page,
      );
    } else {
      transactions =
        await this.transactionService.getAllTransactionsWithoutPagination();
    }
    return {
      message: 'Transactions fetched successfully',
      data: transactions,
    };
  }

  @Get('user-transaction')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({
    name: 'limit',
    required: false,
    schema: { default: 10 },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    schema: { default: 1 },
  })
  @ApiResponse({
    status: 200,
    description: 'List of transactions for the logged-in user',
    type: ApiResponseDto,
  })
  async getUserTransactions(
    @Req() req: any,
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
  ) {
    const userId = req.user.sub;
    const transactions = await this.transactionService.getUserTransactions(
      userId,
      limit,
      page,
    );
    return {
      message: 'Transactions fetched successfully',
      data: transactions,
    };
  }
}
