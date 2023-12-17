import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ZodValidationPipe } from 'nestjs-zod';

export const ZOD_PROVIDER = {
  provide: APP_PIPE,
  useClass: ZodValidationPipe,
};

export const THROTTLER_PROVIDER = {
  provide: APP_GUARD,
  useClass: ThrottlerGuard,
};
