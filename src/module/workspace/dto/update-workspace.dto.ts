import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateWorkspaceSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
});

export class UpdateWorkspaceDto extends createZodDto(UpdateWorkspaceSchema) {
  readonly name: string;
  readonly description: string;
}
