import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CredencialCreateSchema = z.object({
  title: z.string(),
  username: z.string(),
  password: z.string(),
  url: z.string(),
});

export class CreateCredencialDto extends createZodDto(CredencialCreateSchema) {
  readonly title: string;
  readonly username: string;
  password: string;
  readonly vaultId: string;
  readonly url: string;
  readonly notes: string;
}
