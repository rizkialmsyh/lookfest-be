import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'oldPassword123',
    description: 'The current password of the user',
  })
  @IsString()
  @MinLength(6)
  oldPassword: string;

  @ApiProperty({
    example: 'newPassword123',
    description: 'The new password of the user',
  })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
