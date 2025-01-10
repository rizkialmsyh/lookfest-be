import { ApiProperty } from "@nestjs/swagger";

export class ReplyResponseDto {
    @ApiProperty({ example: '123-456-789-1011' })
    id: string;

    @ApiProperty({ example: '123-456-789-1011' })
    userId: string;

    @ApiProperty({ example: '123-456-789-1011' })
    reviewId: string;

    @ApiProperty({ example: 'Review for the product' })
    reply: string;

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
    }    
    })
    user: {
        id: string;
        email: string;
        nickname: string;
    };
}

export class ReplyListResponseDto {
    @ApiProperty({
        description: 'A message indicating the success of the operation',
        example: 'success get all categories',
    })
    message: string;

    @ApiProperty({
        description: 'List of replies',
        type: [ReplyResponseDto],
    })
    replies: ReplyResponseDto[];
}