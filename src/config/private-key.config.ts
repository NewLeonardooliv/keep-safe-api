import { SHIFT } from '../constants/shift.constant';
import { decrypt } from '../helper/caesar-cipher.helper';

export const privateKey = () => {
  return decrypt(process.env.PRIVATE_KEY, SHIFT);
};
