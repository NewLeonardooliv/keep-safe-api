import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const VaultCreateSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
});

export class CreateVaultDto extends createZodDto(VaultCreateSchema) {
  readonly name: string;
  readonly description: string;
}
