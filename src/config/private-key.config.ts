import { SHIFT } from 'src/constants/shift.constant';
import { decrypt } from 'src/helper/caesar-cipher.helper';

export const privateKey = () => {
  return decrypt(process.env.PRIVATE_KEY, SHIFT);
};
