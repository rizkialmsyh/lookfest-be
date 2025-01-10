import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateWishlistDto {
   @ApiProperty({
      description: 'The ID of product to be wishlist',
      example: '1c118cf3-73b2-4649-b7e5-9e5bc2ecdf30',
   })
   @IsNotEmpty()
   @IsString()
   @IsUUID()
   productId: string
}
