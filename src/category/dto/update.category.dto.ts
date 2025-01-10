import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Electronics',
    required: false,
  })
  @IsString()
  @MinLength(3)
  @IsOptional()
  name?: string;
}
