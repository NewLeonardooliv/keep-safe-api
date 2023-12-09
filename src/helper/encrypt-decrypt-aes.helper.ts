import * as CryptoJS from 'crypto-js';

export const encryptAES = (message: string, key: string): string => {
  const ciphertext = CryptoJS.AES.encrypt(message, key);

  return ciphertext.toString();
};

export const decryptAES = (ciphertext: string, key: string): string => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);

  return decryptedMessage;
};
