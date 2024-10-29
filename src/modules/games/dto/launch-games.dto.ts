import { IsOptional, IsString } from 'class-validator';

export class LaunchGamesDto {
  @IsString()
  providerCode: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  gameId: string;

  @IsOptional()
  @IsString()
  lang: string;

  @IsOptional()
  @IsString()
  html5: string;

  @IsOptional()
  @IsString()
  bLimit: string;
}
