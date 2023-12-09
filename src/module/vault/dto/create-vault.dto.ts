import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const VaultCreateSchema = z.object({
  name: z.string(),
});

export class CreateVaultDto extends createZodDto(VaultCreateSchema) {
  readonly name: string;
}
