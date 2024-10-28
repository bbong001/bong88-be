import { ROLES } from '@/shared/constants/role.constant';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, Min } from 'class-validator';

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
  @IsOptional()
  @IsNumber()
  walletBalance?: number;

  @ApiProperty({
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Role phải lớn hơn 0' })
  role?: number;
}
