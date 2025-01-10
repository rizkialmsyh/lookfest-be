import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { MidtransService } from 'src/libs/midtrans/midtrans.service';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { TransactionRepository } from './transaction.repository';

@Module({
  controllers: [TransactionController],
  providers: [
    TransactionService,
    TransactionRepository,
    MidtransService,
    PrismaService,
  ],
})
export class TransactionModule {}
