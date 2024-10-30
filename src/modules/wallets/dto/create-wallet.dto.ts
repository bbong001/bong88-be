import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateWalletDto {


  @IsNotEmpty()
  username: string;

  @IsString()
  thongBao?: string;

  @IsNotEmpty()
  type: string;

  @IsNumber()
  money?: number;

  @IsNumber()
  totalFreeze?: number;

  @IsNotEmpty()
  status?: boolean;
}
