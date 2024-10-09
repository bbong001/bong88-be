import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'xxx@gmail.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '*********',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: '0989898989',
  })
  @IsOptional()
  @IsPhoneNumber('VN', { message: 'Số điện thoại không đúng định dạng.' })
  phoneNumber?: string;

  @ApiProperty({
    example: 'string',
  })
  address?: string;

  @ApiProperty({
    example: `user | admin`,
  })
  @IsString()
  role: string;

  @ApiProperty({
    example: 'string',
  })
  avatar?: string;

  isActive: boolean;
}
