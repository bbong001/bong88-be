import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: '*********',
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    example: 'string',
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({
    example: 'xxx@gmail.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: '84 999999999',
  })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiProperty({
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  accountStatus?: number;

  @ApiProperty({
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Role phải lớn hơn 0' })
  role?: number;
}
