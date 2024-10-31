import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateWalletDto {
  @ApiProperty({
    example: 0,
    required: false,
  })
  @IsNumber()
  balance?: number;

  @ApiProperty({
    example: 0,
    required: false,
  })
  @IsOptional()
  status?: number;
}
