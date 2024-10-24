import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { comparePassword } from '@/shared/utils/hash.util';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@/config/config.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RedisService } from '@/common/services/redis/redis.service';
import { generateJwtRefreshToken } from '@/shared/utils/token.util';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if (!user) {
      throw new UnauthorizedException('Email không tồn tại');
    }

    const isValidPassword = await comparePassword(pass, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Mật khẩu không đúng');
    }

    return user;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user._id };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = generateJwtRefreshToken(
      user.id,
      this.configService.getJwtSecretKey(),
      this.configService.getJwtRefreshTokenExpired(),
    );

    const refreshTokenTTL = this.parseDuration(this.configService.getJwtRefreshTokenExpired());

    await this.redisService.setValue(user.id, refreshToken, refreshTokenTTL / 1000);

    // await this.cacheManager.set(user.id, refreshToken, refreshTokenTTL);

    return {
      accessToken,
      refreshToken,
    };
  }

  // Hàm parseDuration để chuyển đổi chuỗi thời gian thành ms
  private parseDuration(duration: string): number {
    const regex = /^(\d+)([smhd])$/;
    const match = duration.match(regex);
    if (!match) {
      throw new Error('Invalid duration format');
    }
    const value = parseInt(match[1], 10);
    const unit = match[2];
    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        throw new Error('Invalid duration unit');
    }
  }
}
