import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class CreateReplyDto {
    @ApiProperty({
        example: '123-456-789-1011',
        description: 'The product ID of the review',
        required: true,
    })
    @IsUUID()
    reviewId: string;

    @ApiProperty({
        example: 'Review for the product',
        description: 'The review of the product',
        required: true,
    })
    @IsString()
    reply: string;
}
