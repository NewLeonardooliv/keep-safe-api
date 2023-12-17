import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateCredencialSchema = z.object({
  title: z.string(),
  username: z.string(),
  password: z.string(),
  url: z.string(),
});

export class UpdateCredencialDto extends createZodDto(UpdateCredencialSchema) {
  readonly title: string;
  readonly username: string;
  password: string;
  readonly url: string;
  readonly notes: string;
}
