import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const VaultUpdateSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
});

export class UpdateVaultDto extends createZodDto(VaultUpdateSchema) {
  readonly name: string;
  readonly description: string;
}
