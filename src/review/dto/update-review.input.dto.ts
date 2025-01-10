import { IsString, IsOptional, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewDto {    
    @ApiProperty({
        example: '123-456-789-1011',
        description: 'The product ID of the review',
        required: false,
    })
    @IsOptional()
    @IsUUID()
    productId?: string;

    @ApiProperty({
        example: 5,
        description: 'The updated rating of review',
        required: false,
    })
    @IsOptional()
    @IsNumber()
    rating?: number;

    @ApiProperty({
        example: 'Updated review for the product',
        description: 'The updated review of the product',
        required: false,
    })
    @IsOptional()
    @IsString()
    review?: string;
}
