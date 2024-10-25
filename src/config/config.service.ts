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

  getJwtPublicKey(): string {
    const _publicKey = this.configService.get<string>('JWT_PUBLIC_KEY');
    return Buffer.from(_publicKey, 'base64').toString('utf-8');
  }

  getJwtPrivateKey(): string {
    const _privateKey = this.configService.get<string>('JWT_PRIVATE_KEY');
    return Buffer.from(_privateKey, 'base64').toString('utf-8');
  }

  getJwtAccessTokenExpired(): string {
    return this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRED');
  }

  getJwtRefreshTokenExpired(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN');
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

  getRedisHost(): string {
    return this.configService.get<string>('REDIS_HOST');
  }

  getRedisPort(): number {
    return this.configService.get<number>('REDIS_PORT');
  }

  getRedisUsername(): string {
    return this.configService.get<string>('REDIS_USERNAME');
  }

  getRedisPassword(): string {
    return this.configService.get<string>('REDIS_PASSWORD');
  }

  getRedisDB(): number {
    return this.configService.get<number>('REDIS_DB');
  }
}
