import { ROLES } from '@/shared/constants/role.constant';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '*********',
    required: true,
  })
  password: string;

  @ApiProperty({
    example: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: 'xxx@gmail.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '84 999999999',
  })
  @IsOptional()
  // @IsPhoneNumber('VN', { message: 'Số điện thoại không đúng định dạng.' })
  mobile?: string;

  @ApiProperty({
    example: 0,
  })
  @IsNumber()
  @IsOptional()
  walletBalance?: number;

  @ApiProperty({
    example: 0,
    description: 'The full name of the user',
  })
  @IsNumber()
  @IsOptional()
  role?: number;
}
