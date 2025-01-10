import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  @ApiProperty({
    example: 'Johnny',
  })
  nickname: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'Login success message',
    example: 'Login successful',
  })
  message: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDI3Yzk5Ny0xMTc0LTQ0MGQtOTM3Ny1kYmZhYTZiMWQ2ZWIiLCJlbWFpbCI6Im11aGFtbWFkMjAwMDAxODQzMEB3ZWJtYWlsLnVhZC5hYy5pZCIsImlhdCI6MTczNTYyMDEwMSwiZXhwIjoxNzM1NzA2NTAxfQ.qryzRpOwqtZuqkFh-or_o43SafebxX4yJLQ212WSTNA',
  })
  token: string;

  @ApiProperty({
    example: {
      id: '0027c997-1174-440d-9377-dbfaa6b1d6eb',
      role: 'user',
      profiles: 'Johnny',
    },
  })
  user: {
    id: string;
    role: string;
    nickname: string;
  };
}
