import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateReplyDto {
    @ApiProperty({
        example: '123-456-789-1011',
        description: 'The review ID of the review',
        required: false,
    })
    @IsOptional()
    @IsUUID()
    reviewId?: string;

    @ApiProperty({
        example: 'Updated review for the product',
        description: 'The updated review of the product',
        required: false,
    })
    @IsOptional()
    @IsString()
    reply?: string;
}