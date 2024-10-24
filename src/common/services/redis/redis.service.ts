import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async setValue(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redisClient.set(key, value, 'EX', ttl);
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async getValue(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async checkConnection(): Promise<boolean> {
    try {
      const pong = await this.redisClient.ping();
      return pong === 'PONG';
    } catch (error) {
      console.error('Redis connection check failed:', error);
      return false;
    }
  }

  /**
   * Đóng kết nối Redis khi module bị hủy.
   */
  async onModuleDestroy() {
    await this.redisClient.quit();
  }
}
