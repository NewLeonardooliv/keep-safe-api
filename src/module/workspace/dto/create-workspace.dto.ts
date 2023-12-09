import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const WorkspaceCreateSchema = z.object({
  name: z.string(),
});

export class CreateWorkspaceDto extends createZodDto(WorkspaceCreateSchema) {
  readonly name: string;
}
