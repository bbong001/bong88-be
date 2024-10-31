import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutDto {
  @ApiProperty({
    description: 'Access token được cấp khi đăng nhập',
    example: 'string',
  })
  @IsString()
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token được cấp khi đăng nhập',
    example: 'string',
  })
  @IsString()
  refreshToken: string;
}
