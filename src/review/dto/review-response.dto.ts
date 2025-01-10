import { ApiProperty } from "@nestjs/swagger";

export class ReviewResponse {
    @ApiProperty({ example: '123-456-789-1011' })
    id: string;

    @ApiProperty({ example: '123-456-789-1011' })
    userId: string;

    @ApiProperty({ example: '123-456-789-1011' })
    productId: string;

    @ApiProperty({ example: 5 })
    rating: number;

    @ApiProperty({ example: 'Review for the product' })
    review: string;

    @ApiProperty({ example: '2021-09-22T00:00:00.000Z' })
    createdAt: Date;

    @ApiProperty({ example: '2021-09-22T00:00:00.000Z' })
    updatedAt: Date;

    @ApiProperty({ example: {
        user: {
            id: '123-456-789-1011',
            email: 'user@example.com',
            nickname: 'user123',
        }
    }})
    user: {
        id: string;
        email: string;
        nickname: string;
    };

    @ApiProperty({ example: {
        reply: {
            id: '123-456-789-1011',
            userId: '123-456-789-1011',
            reviewId: '123-456-789-1011',
            reply: 'Reply for the product',
            createdAt: '2021-09-22T00:00:00.000Z',
            updatedAt: '2021-09-22T00:00:00.000Z',
            user: {
                id: '123-456-789-1011',
                email: 'user@example.com',
                nickname: 'user123',
            },
        }
    }})
    reply: {
        id: string,
        userId: string,
        reviewId: string,
        reply: string,
        createdAt: Date,
        updatedAt: Date,
        user: {
            id: string,            
            email: string,
            nickname: string,
        },
    }
}

export class PaginationResponse {
    @ApiProperty({ example: 1 })
    currentPage: number;

    @ApiProperty({ example: 5 })
    totalPages: number;

    @ApiProperty({ example: 50 })
    totalCount: number;

    @ApiProperty({ example: 10 })
    limit: number;
}

export class ReviewListResponseDto {
    @ApiProperty({
        description: 'A message indicating the success of the operation',
        example: 'success get all reviews',
    })
    message: string;

    @ApiProperty({
        description: 'List of reviews',
        type: [ReviewResponse],
        example: [
            {
                id: '123-456-789-1011',
                userId: '123-456-789-1011',
                productId: '123-456-789-1011',
                rating: 5,
                review: 'Review for the product',
                createdAt: '2021-09-22T00:00:00.000Z',
                updatedAt: '2021-09-22T00:00:00.000Z',
                user: {
                    id: '123-456-789-1011',
                    email: 'user@example.com',
                    nickname: 'user123',
                },
                reply: {
                    id: '123-456-789-1011',
                    userId: '123-456-789-1011',
                    reviewId: '123-456-789-1011',
                    reply: 'Reply for the product',
                    createdAt: '2021-09-22T00:00:00.000Z',
                    updatedAt: '2021-09-22T00:00:00.000Z',
                    user: {
                        id: '123-456-789-1011',
                        email: 'user@example.com',
                        nickname: 'user123',
                    },
                }

            },
        ]
    })
    review: ReviewResponse[];

    @ApiProperty({ example: 4.5 })
    avgRating: number;

    @ApiProperty({
        type: PaginationResponse,
        example: { currentPage: '1', totalPages: 5, totalCount: 50, limit: '10' },
    })
    pagination: PaginationResponse;
}