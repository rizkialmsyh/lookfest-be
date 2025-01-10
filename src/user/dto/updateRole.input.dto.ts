import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsString, MinLength } from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({
    example: '1234-5678-9012-3456',
    description: 'User ID',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    example: 'user',
    description: 'Role for user',
  })
  @IsString()
  role: Role;
}
