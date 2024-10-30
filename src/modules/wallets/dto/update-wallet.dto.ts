import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class UpdateWalletDto {
  @IsOptional()
  @IsString()
  thongBao?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsNumber()
  money?: number;

  @IsOptional()
  @IsNumber()
  totalFreeze?: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
