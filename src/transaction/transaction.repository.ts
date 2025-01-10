import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/prisma/prisma.service';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  findProductById(productId: string) {
    return this.prisma.product.findUnique({
      where: { id: productId },
    });
  }

  createTransaction(data: {
    id: string;
    userId: string;
    productId: string;
    totalAmount: number;
    totalItems: number;
    status: string;
  }) {
    return this.prisma.transaction.create({ data });
  }

  updateTransaction(orderId: string, data: any) {
    return this.prisma.transaction.update({
      where: { id: orderId },
      data,
    });
  }

  findTransactionById(orderId: string) {
    return this.prisma.transaction.findFirst({
      where: { id: orderId },
    });
  }

  updateProductStock(productId: string, newStock: number) {
    return this.prisma.product.update({
      where: { id: productId },
      data: { stock: newStock },
    });
  }

  getTransactionsWithPagination(skip: number, take: number) {
    return this.prisma.transaction.findMany({
      skip,
      take: Number(take),
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            profiles: {
              select: {
                nickname: true,
                fullname: true,
              },
            },
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  countTotalTransactions() {
    return this.prisma.transaction.count();
  }

  getAllTransactions() {
    return this.prisma.transaction.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            profiles: {
              select: {
                nickname: true,
                fullname: true,
              },
            },
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  getAggregatedTransactionData() {
    return this.prisma.transaction.aggregate({
      _sum: {
        totalAmount: true,
        totalItems: true,
      },
      where: {
        status: 'success',
      },
    });
  }

  getTransactionCounts() {
    return this.prisma.transaction.aggregate({
      _count: {
        id: true,
      },
      where: {
        status: 'success',
      },
    });
  }

  async getTransactionsByUser(userId: string, skip: number, take: number) {
    return this.prisma.transaction.findMany({
      skip,
      take: Number(take),
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            profiles: {
              select: {
                nickname: true,
                fullname: true,
              },
            },
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            images: {
              select: {
                imageUrl: true,
              },
            },
          },
        },
      },
    });
  }

  async countUserTransactions(userId: string) {
    return this.prisma.transaction.count({ where: { userId } });
  }

  async findReviewByProductAndUser(productId: string, userId: string) {
    return this.prisma.review.findFirst({
      where: { productId, userId },
    });
  }
}
