import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.input.dto';
import { UpdateReviewDto } from './dto/update-review.input.dto';
import { ReviewRepository } from './review.repository';
import { ReviewListResponseDto, ReviewResponse } from './dto/review-response.dto';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository
  ) {}

  async findAllByProductId( page: number, limit: number, productId?: string): Promise<ReviewListResponseDto> {
    const {reviewData, avgRating, totalPages} = await this.reviewRepository.getAllReviewsByProductId(page, limit, productId);

    if (reviewData.length === 0) {
      return {
        message: 'No reviews found',
        review: [],
        avgRating: 0,
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalCount: 0,
          limit: limit,
        },
      };
    }

    return {
      message: 'success get all reviews',
      review: reviewData,
      avgRating,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: reviewData.length,
        limit: limit,
      },
    };
  }

  async findAll(
    page: number, 
    limit: number, 
    isReply?: string
  ): Promise<any> {
    const { reviewData, totalCount, totalPages } = await this.reviewRepository.getAllReviews(
      page, 
      limit,
      isReply,
    );

    if (reviewData.length === 0) {
      return {
        message: 'No reviews found',
        review: [],
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit: limit,
        },
      };
    }

    return {
      message: 'success get all reviews',
      review: reviewData,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit: limit,
      },
    };
  }
  
  async create(userId: string, productId: string, rating: number, reviewText: string): Promise<any> {
    
    const checkReview = await this.reviewRepository.findReviewByUserIdAndProductId(userId, productId);
    console.log(checkReview)
    if (checkReview.length > 0) {
      return {
        message: 'You have already reviewed this product',
      };
    }

    const review = await this.reviewRepository.createReview({      
      userId,
      productId,
      rating,
      review: reviewText,
    });

    if (!review) {
      return {
        message: 'Failed to create review',
      };
    }

    return { message: 'Review created successfully' };
  }

  async findOne(id: string): Promise<ReviewResponse> | null {
    const review = await this.reviewRepository.findReviewById(id);
    if (!review) {
      throw new BadRequestException('Review not found');
    }

    return {
      message: 'success get review',
      ...review
    }
  }

  async update(id: string, userId: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.reviewRepository.findReviewById(id);
    if (!review) {
      throw new BadRequestException('Review not found');
    }

    if (review.userId !== userId) {
      throw new BadRequestException('You are not allowed to update this review');
    }

    await this.reviewRepository.updateReview(id, updateReviewDto);

    return { message: 'Review updated successfully' };
  }

  async remove(id: string, userId: string) {
    const review = await this.reviewRepository.findReviewById(id);
    if (!review) {
      throw new BadRequestException('Review not found');
    }

    if (review.userId !== userId) {
      throw new BadRequestException('You are not allowed to delete this review');
    }

    await this.reviewRepository.deleteReview(id);

    return { message: 'Review deleted successfully' };
  }
}
