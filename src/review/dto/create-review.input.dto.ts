import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsUUID } from "class-validator";

export class CreateReviewDto {
    @ApiProperty({
        example: '123-456-789-1011',
        description: 'The product ID of the review',
        required: true,
    })
    @IsUUID()
    productId: string;

    @ApiProperty({
        example: 5,
        description: 'The rating of review',
        required: true,
    })
    @IsNumber()
    rating: number;

    @ApiProperty({
        example: 'Review for the product',
        description: 'The review of the product',
        required: true,
    })
    @IsString()
    review: string;
}
