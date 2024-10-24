// src/common/redis/redis.module.ts
import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { ConfigModule } from '@/config/config.module';
import { ConfigService } from '@/config/config.service';
import { RedisService } from './redis.service';
import Redis from 'ioredis';

@Global()
@Module({
  imports: [
    ConfigModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<any> => ({
        store: redisStore,
        host: configService.getRedisHost() || '127.0.0.1',
        port: configService.getRedisPort() || 6379,
        username: configService.getRedisUsername() || undefined,
        password: configService.getRedisPassword() || undefined,
        db: configService.getRedisDB() || 0,
        ttl: 60,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService): Promise<any> => {
        const redisOptions = {
          host: configService.getRedisHost() || '127.0.0.1',
          port: configService.getRedisPort() || 6379,
          username: configService.getRedisUsername() || undefined,
          password: configService.getRedisPassword() || undefined,
          db: configService.getRedisDB() || 0,
        };

        const client = new Redis(redisOptions);

        // Thêm các event listeners để quản lý trạng thái kết nối
        client.on('connect', () => {
          console.log('Redis client connected');
        });

        client.on('ready', () => {
          console.log('Redis client ready');
        });

        client.on('error', (err) => {
          console.error('Redis client error:', err);
        });

        client.on('end', () => {
          console.log('Redis client disconnected');
        });

        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [CacheModule, 'REDIS_CLIENT', RedisService],
})
export class RedisModule {}
