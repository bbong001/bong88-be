import { WALLET_TYPE } from '@/shared/constants/wallet.constant';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateWalletDto {
  @ApiProperty({
    example: 'string',
    required: true,
  })
  @IsNotEmpty()
  userId: Types.ObjectId;

  @ApiProperty({
    example: 'string',
    required: true,
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: WALLET_TYPE.MAIN,
    required: false,
  })
  @IsOptional()
  @IsString()
  wallet: string;

  @ApiProperty({
    example: 0,
    required: false,
  })
  @IsNumber()
  balance?: number;

  @ApiProperty({
    example: 'string',
    required: true,
  })
  @IsString()
  parentWalletId: Types.ObjectId;

  @ApiProperty({
    example: 0,
    required: false,
  })
  @IsOptional()
  status?: number;
}
