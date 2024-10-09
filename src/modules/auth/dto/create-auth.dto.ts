import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống.' })
  @ApiProperty({
    example: 'xxx@gmail.com',
    required: true,
  })
  @IsEmail()
  username: string;

  @ApiProperty({
    example: 'string',
    required: true,
  })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống.' })
  password: string;
}
