import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdatePasswordSchema = z.object({
  title: z.string(),
  username: z.string(),
  password: z.string(),
  url: z.string(),
});

export class UpdatePasswordDto extends createZodDto(UpdatePasswordSchema) {
  readonly title: string;
  readonly username: string;
  readonly password: string;
  readonly url: string;
  readonly notes: string;
}
