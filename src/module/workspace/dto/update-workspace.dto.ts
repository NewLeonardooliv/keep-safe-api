import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const WorkspaceUpdateSchema = z.object({
  name: z.string(),
});

export class UpdateWorkspaceDto extends createZodDto(WorkspaceUpdateSchema) {
  readonly name: string;
}
