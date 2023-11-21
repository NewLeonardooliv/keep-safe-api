import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const SignupAuthSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string(),
  password: z.string(),
});

export class SignupAuthDto extends createZodDto(SignupAuthSchema) {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}
