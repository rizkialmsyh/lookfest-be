import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/prisma/prisma.service';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllReviewsByProductId(
    page: number = 1,
    limit: number = 10,
    productId?: string,
  ): Promise<{
    reviewData: any[];
    avgRating: number | null;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const avgRating = await this.prisma.review.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        productId,
      },
    });

    if (avgRating._avg.rating === null) return { reviewData: [], avgRating: 0, totalPages: 0 };

    const totalReviews = await this.prisma.review.count({
      where: {
        productId,
      },
    });

    const reviews = await this.prisma.review.findMany({
      where: {
        productId,
      },
      include: {
        user: {
          include: {
            profiles: true,
          },
        },
        Reply: {
            include: {
                user: {
                    include:{
                        profiles: true
                    }
                }
            }
        }
      },
      skip: skip || 0,
      take: Number(limit),
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalPages = Math.ceil(totalReviews / limit);

    const reviewData = reviews.map((review) => ({
      id: review.id,
      userId: review.userId,
      productId: review.productId,
      rating: review.rating,
      review: review.review,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      user: {
        id: review.user.id,
        email: review.user.email,
        nickname: review.user.profiles?.[0]?.nickname || null,
      },
      reply: review.Reply.map((reply) => ({
        id: reply.id,
        userId: reply.userId,
        reviewId: reply.reviewId,
        reply: reply.reply,
        createdAt: reply.createdAt,
        updatedAt: reply.updatedAt,
        user: {
            id: reply.user.id,
            email: reply.user.email,
            nickname: reply.user.profiles?.[0]?.nickname || null,
        },
      })),
    }));

    return {
      reviewData,
      avgRating: avgRating._avg.rating || null,
      totalPages,
    };
  }

  async getAllReviews(
    page: number = 1,
    limit: number = 10,
    isReply?: string,
  ): Promise<{
    reviewData: any[];
    totalCount: number | null;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const isReplyBoolean =
      isReply === 'true' ? true : isReply === 'false' ? false : undefined;

    const whereCondition =
      isReplyBoolean === undefined
        ? {}
        : isReplyBoolean === true
          ? { Reply: { some: {} } }
          : { Reply: { none: {} } };

    const reviews = await this.prisma.review.findMany({
      where: whereCondition,
      include: {
        user: {
          include: {
            profiles: true,
          },
        },
        product: true,
        Reply: true,
      },
      take: Number(limit),
      skip: skip || 0,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const reviewData = reviews.map((review) => ({
      id: review.id,
      userId: review.userId,
      productId: review.productId,
      rating: review.rating,
      review: review.review,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      user: {
        id: review.user.id,
        email: review.user.email,
        nickname: review.user.profiles?.[0]?.nickname || null,
      },
      product: {
        name: review.product.name,
      },
      Reply: review.Reply.map((reply) => ({
        id: reply.id,
        reviewId: reply.reviewId,
        reply: reply.reply,
      })),
    }));

    const totalCount = await this.prisma.review.count({
      where: whereCondition,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      reviewData,
      totalCount,
      totalPages,
    };
  }

  async createReview(data: {
    userId: string;
    productId: string;
    rating: number;
    review: string;
  }): Promise<any> {
    return this.prisma.review.create({
      data,
    });
  }

  async findReviewById(reviewId: string): Promise<any> {
    return this.prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
          include: {
            profiles: {
              select: {
                nickname: true,
              },
            },
          },
        },
      },
    });
  }

  async findReviewByUserIdAndProductId(
    userId: string,
    productId: string,
  ): Promise<any> {
    return this.prisma.review.findMany({
      where: {
        userId,
        productId,
      },
    });
  }

  async updateReview(reviewId: string, data: any): Promise<any> {
    const updateData: any = {
      rating: data.rating,
      review: data.review,
    };

    return this.prisma.review.update({
      where: {
        id: reviewId,
      },
      data: updateData,
    });
  }

  async deleteReview(reviewId: string): Promise<any> {
    return this.prisma.review.delete({
      where: {
        id: reviewId,
      },
    });
  }
}
