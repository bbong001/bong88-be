import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateWalletDto {


  @IsNotEmpty()
  username: string;

  @IsNumber()
  balance?: number;

  @IsNumber()
  totalFreeze?: number;

  
}
