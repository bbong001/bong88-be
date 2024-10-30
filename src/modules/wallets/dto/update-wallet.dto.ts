import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class UpdateWalletDto {
  @IsOptional()
  @IsString()
  username: string;


  @IsOptional()
  @IsNumber()
  balance?: number;


}
