import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigService } from './config.service';

@Module({
  imports: [
    // Load config from .env file and environment variables
    NestConfigModule.forRoot({
      isGlobal: true, // ConfigModule will be available globally
      envFilePath: `.env`, // Path to your .env file
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
