import { Injectable } from '@nestjs/common';
import { MidtransService } from 'src/libs/midtrans/midtrans.service';
import { randomUUID } from 'crypto';
import { Decimal } from '@prisma/client/runtime/library';
import { TransactionRepository } from './transaction.repository';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly midtransService: MidtransService,
  ) {}

  async createTransaction(userId: string, productId: string, quantity: number) {
    const product = await this.transactionRepository.findProductById(productId);

    if (!product) {
      return { message: 'Product not found' };
    }

    if (product.stock < quantity) {
      return { message: 'Insufficient stock' };
    }

    const orderId = randomUUID();
    const customerDetails = { id: userId };

    await this.transactionRepository.createTransaction({
      id: orderId,
      userId,
      productId,
      totalAmount: product.price.toNumber() * quantity,
      totalItems: quantity,
      status: 'pending',
    });

    const snapTransaction = await this.midtransService.createTransaction(
      orderId,
      product.price.toNumber() * quantity,
      customerDetails,
    );

    await this.transactionRepository.updateTransaction(orderId, {
      paymentUrl: snapTransaction.redirect_url,
    });

    return {
      message: 'Transaction created successfully',
      data: { orderId, paymentUrl: snapTransaction.redirect_url },
    };
  }

  async updateTransactionStatus(
    orderId: string,
    transaction_status: string,
    payment_type: string,
  ) {
    const transaction =
      await this.transactionRepository.findTransactionById(orderId);

    if (!transaction) {
      return { message: 'Transaction not found' };
    }

    let updatedStatus = transaction.status;

    if (transaction_status === 'settlement') {
      updatedStatus = 'success';
      await this.transactionRepository.updateTransaction(orderId, {
        paymentMethod: payment_type,
      });

      const product = await this.transactionRepository.findProductById(
        transaction.productId,
      );

      if (product) {
        const totalAmount =
          transaction.totalAmount instanceof Decimal
            ? transaction.totalAmount.toNumber()
            : transaction.totalAmount;

        const stock = Number(product.stock);
        const price = product.price.toNumber();

        await this.transactionRepository.updateProductStock(
          product.id,
          stock - totalAmount / price,
        );
      }
    } else if (['deny', 'cancel', 'expire'].includes(transaction_status)) {
      updatedStatus = 'failed';
    }

    await this.transactionRepository.updateTransaction(transaction.id, {
      status: updatedStatus,
    });

    return { message: 'Transaction status updated successfully' };
  }

  async getAllTransactions(limit: number, page: number) {
    const skip = (page - 1) * limit;
    const take = Number(limit);

    const transactions =
      await this.transactionRepository.getTransactionsWithPagination(
        skip,
        take,
      );

    const aggregatedData =
      await this.transactionRepository.getAggregatedTransactionData();

    const successTransactionCount =
      await this.transactionRepository.getTransactionCounts();

    const totalTransactions =
      await this.transactionRepository.countTotalTransactions();

    return {
      transactions,
      aggregatedData,
      successTransactionCount,
      meta: {
        total: totalTransactions,
        page,
        limit,
      },
    };
  }

  async getAllTransactionsWithoutPagination() {
    const transactions = await this.transactionRepository.getAllTransactions();
    return transactions;
  }

  async getUserTransactions(userId: string, limit: number, page: number) {
    const skip = (page - 1) * limit;
    const take = Number(limit);

    const transactions = await this.transactionRepository.getTransactionsByUser(
      userId,
      skip,
      take,
    );

    const transactionsWithReviewStatus = await Promise.all(
      transactions.map(async (transaction) => {
        const reviewExists =
          await this.transactionRepository.findReviewByProductAndUser(
            transaction.productId,
            userId,
          );
        return {
          ...transaction,
          reviewed: !!reviewExists,
        };
      }),
    );

    const totalTransactions =
      await this.transactionRepository.countUserTransactions(userId);

    return {
      transactions: transactionsWithReviewStatus,
      meta: {
        total: totalTransactions,
        page,
        limit,
      },
    };
  }
}
