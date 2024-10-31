import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { comparePassword } from '@/shared/utils/hash.util';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@/config/config.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RedisService } from '@/common/services/redis/redis.service';
import { generateRefreshToken } from '@/shared/utils/token.util';
import { REDIS_KEY } from '@/shared/constants/redis-key.constant';
import dayjs from '@/shared/utils/dayjs.util';
import { UnauthorizedErrorCode } from '@/shared/constants/error-code.constants';
import { WalletsService } from '../wallets/wallets.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private walletsService: WalletsService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    const isValidPassword = await comparePassword(pass, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Mật khẩu không đúng');
    }

    return user;
  }

  async login(user: any): Promise<any> {
    try {
      const payload = { sub: user._id, username: user.username, role: user.role };
      const accessToken = this.jwtService.sign(payload);
      const refreshToken = generateRefreshToken();

      const accessTokenTTL = this.parseDuration(this.configService.getJwtAccessTokenExpired());
      const refreshTokenTTL = this.parseDuration(this.configService.getJwtRefreshTokenExpired());

      await this.redisService.setValue(`${REDIS_KEY.ACCESS_TOKEN}:${accessToken}`, user.id, accessTokenTTL / 1000);
      await this.redisService.setValue(`${REDIS_KEY.REFRESH_TOKEN}:${refreshToken}`, user.id, refreshTokenTTL / 1000);

      // const accessTokenExpiredAt = new Date(Date.now() + accessTokenTTL * 1000).toISOString();
      // const refreshTokenExpiredAt = new Date(Date.now() + refreshTokenTTL * 1000).toISOString();

      const userInfo = await this.usersService.findByUsername(user.username);
      const wallets = await this.walletsService.findByUsername(user.username);
      return {
        tokenInfos: {
          accessToken,
          refreshToken,
        },
        userInfos: userInfo,
        wallets,
        // accessTokenExpiredAt: accessTokenExpiredAt,
        // refreshTokenExpiredAt: refreshTokenExpiredAt,
      };
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(oldRefreshToken: string): Promise<any> {
    try {
      // Lấy userId từ Redis dựa trên refreshToken
      const userId = await this.redisService.getValue(`${REDIS_KEY.REFRESH_TOKEN}:${oldRefreshToken}`);
      if (!userId) {
        throw new UnauthorizedException({
          errorCode: UnauthorizedErrorCode.INVALID_REFRESH_TOKEN,
          message: 'Invalid refresh token',
        });
      }

      // Tạo payload cho access token mới
      const payload = { sub: userId };
      const newAccessToken = this.jwtService.sign(payload);

      // Tạo refresh token mới
      const newRefreshToken = generateRefreshToken();
      const refreshTokenTTL = this.parseDuration(this.configService.getJwtRefreshTokenExpired());
      const accessTokenTTL = this.parseDuration(this.configService.getJwtAccessTokenExpired());

      await this.redisService.setValue(`${REDIS_KEY.REFRESH_TOKEN}:${newRefreshToken}`, userId, refreshTokenTTL / 1000);
      await this.redisService.setValue(`${REDIS_KEY.ACCESS_TOKEN}:${newAccessToken}`, userId, accessTokenTTL / 1000);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async logout(accessToken: string, refreshToken: string): Promise<any> {
    try {
      const _accessTokenCache = await this.redisService.getValue(`${REDIS_KEY.ACCESS_TOKEN}:${accessToken}`);
      if (!_accessTokenCache)
        throw new UnauthorizedException({
          errorCode: UnauthorizedErrorCode.INVALID_ACCESS_TOKEN,
          message: 'Invalid access token',
        });

      const _refreshTokenCache = await this.redisService.getValue(`${REDIS_KEY.REFRESH_TOKEN}:${refreshToken}`);
      if (!_refreshTokenCache)
        throw new UnauthorizedException({
          errorCode: UnauthorizedErrorCode.INVALID_REFRESH_TOKEN,
          message: 'Invalid refresh token',
        });

      // Delete both access and refresh tokens from Redis to revoke them
      await this.redisService.deleteValue(`${REDIS_KEY.ACCESS_TOKEN}:${accessToken}`);
      await this.redisService.deleteValue(`${REDIS_KEY.REFRESH_TOKEN}:${refreshToken}`);

      return null;
    } catch (error) {
      throw error;
    }
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
