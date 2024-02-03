import * as crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const key = 'v7BPsyeFZ5jwUgi84ZR7CnRGdJgAsC1f';
const lv = '0123456789012345';

/**
 * 加密
 * @param id
 */
export function idEncrypt(id: string) {
  const cipher = crypto.createCipheriv(algorithm, key, lv);
  return cipher.update(id, 'utf8', 'hex');
}

/**
 * 解密
 * @param id
 */
export function idDecrypt(id: string) {
  try {
    const decipher = crypto.createDecipheriv(algorithm, key, lv);
    return decipher.update(id, 'hex', 'utf8');
  } catch (e) {
    return id;
  }
}
