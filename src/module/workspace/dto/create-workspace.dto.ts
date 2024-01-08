import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createWorkspaceSchema = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
});

export class CreateWorkspaceDto extends createZodDto(createWorkspaceSchema) {
  readonly name: string;
  readonly description: string;
}
