import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  getMongoDbUrl(): string {
    return this.configService.get<string>('MONGODB_URL');
  }

  getJwtSecretKey(): string {
    return this.configService.get<string>('JWT_SECRET_KEY');
  }

  getJwtAccessTokenExpired(): string {
    return this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRED');
  }

  getGSApiUrl(): string {
    return this.configService.get<string>('GS_API_URL');
  }

  getGSOperatorCode(): string {
    return this.configService.get<string>('GS_OPERATOR_CODE');
  }

  getGSSecretKey(): string {
    return this.configService.get<string>('GS_SECRET_KEY');
  }
}
