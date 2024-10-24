// src/common/utils/token.util.ts
import { sign } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

/**
 * Tạo một refresh token sử dụng JWT.
 * @param userId ID của người dùng.
 * @param secret Khóa bí mật để ký token.
 * @param expiresIn Thời gian hết hạn của token (ví dụ: '7d').
 * @returns Chuỗi refresh token.
 */
export function generateJwtRefreshToken(userId: string, secret: string, expiresIn: string = '7d'): string {
  const payload = {
    sub: userId,
    jti: uuidv4(), // Unique identifier for the token
  };

  return sign(payload, secret, { expiresIn });
}
