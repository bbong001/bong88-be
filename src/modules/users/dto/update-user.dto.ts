import { IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsString()
  avt?: string;

  @IsOptional()
  @IsString()
  walletBalance?: number;

  @IsOptional()
  @IsString()
  accountStatus?: number;
}
