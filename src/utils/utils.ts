import { randomBytes, scryptSync } from 'crypto';

export function genSalt() {
  return randomBytes(128).toString('base64');
}

export function hashPassword(password: string) {
  return scryptSync(password, genSalt(), 64).toString('hex');
}
