import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const VaultUpdateSchema = z.object({
  name: z.string(),
});

export class UpdateVaultDto extends createZodDto(VaultUpdateSchema) {
  readonly name: string;
}
