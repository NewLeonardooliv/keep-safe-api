import * as crypto from 'crypto';

export function encryptAndHash(
  data: string,
  publicKey: string,
): { encryptedData: string; hash: string } {
  const bufferData = Buffer.from(data, 'utf-8');
  const encryptedData = crypto.publicEncrypt(publicKey, bufferData);

  const hash = crypto.createHash('sha256').update(encryptedData).digest('hex');

  return {
    encryptedData: encryptedData.toString('base64'),
    hash: hash,
  };
}

export function decrypt(
  encryptedData: string,
  privateKey: string,
  hash: string,
): string | null {
  const decryptedHash = crypto
    .createHash('sha256')
    .update(Buffer.from(encryptedData, 'base64'))
    .digest('hex');

  if (decryptedHash !== hash) {
    console.error('Hash não corresponde. A mensagem pode ter sido alterada.');
    return null;
  }

  const bufferEncryptedData = Buffer.from(encryptedData, 'base64');
  const decryptedData = crypto.privateDecrypt(privateKey, bufferEncryptedData);

  return decryptedData.toString('utf-8');
}
