import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { privateKey } from 'src/config/private-key.config';
import { decryptAES } from 'src/helper/encrypt-decrypt-aes.helper';

export const Decrypt = createParamDecorator(
  async (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const encryptedData = request.body.data;
    const data = decryptAES(encryptedData, privateKey());

    return JSON.parse(data);
  },
);
