import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

export async function hashPassword(password: string, saltRounds = 10): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export function hashMD5(data: string): string {
  return crypto.createHash('md5').update(data).digest('hex');
}

export function base64Encoded(data: string, length = 12): string {
  const sha256Hash = crypto.createHash('sha256').update(data).digest();
  const base64Hash = sha256Hash
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, length);

  return base64Hash;
}
