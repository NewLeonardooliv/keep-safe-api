import * as crypto from 'crypto';

export const encryptA256GCM = (
  data: string,
  key: Buffer,
): { iv: Buffer; encryptedData: Buffer; tag: Buffer } => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encryptedData = Buffer.concat([
    cipher.update(data, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return { iv, encryptedData, tag };
};

export const decryptA256GCM = (
  encryptedData: Buffer,
  key: Buffer,
  iv: Buffer,
  tag: Buffer,
): string | null => {
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);

  try {
    const decryptedData = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);
    return decryptedData.toString('utf8');
  } catch (error) {
    console.error('Erro ao descriptografar:', error);
    return null;
  }
};
