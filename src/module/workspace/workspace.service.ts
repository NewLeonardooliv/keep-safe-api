import {
  Workspace as WorkspacePersistence,
  WorkspaceUser as WorkspaceUserPersistence,
} from '@prisma/client';
import { PrismaService } from 'src/service/database/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(private readonly db: PrismaService) {}

  async findAllWorkspaces(signedUserId: string) {
    const workspacesUsers = await this.db.workspaceUser.findMany({
      where: {
        userId: signedUserId,
      },
    });

    const workspacesToFind = workspacesUsers.map(
      (workspacesUser: WorkspaceUserPersistence) => workspacesUser.workspaceId,
    );

    const workspaces = await this.findAll(workspacesToFind);

    return workspaces;
  }

  async findAll(workspacesIds: string[]): Promise<WorkspacePersistence[]> {
    const workspace = await this.db.workspace.findMany({
      where: {
        id: {
          in: workspacesIds,
        },
      },
    });

    return workspace;
  }

  async create(
    userId: string,
    createWorkspaceDto: CreateWorkspaceDto,
  ): Promise<WorkspacePersistence> {
    const workspace = await this.db.workspace.create({
      data: createWorkspaceDto,
    });

    await this.db.workspaceUser.create({
      data: { userId: userId, workspaceId: workspace.id },
    });

    return workspace;
  }

  async update(
    workspaceId: string,
    signedUserId: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ): Promise<WorkspacePersistence> {
    const workspace = await this.findOne(workspaceId, signedUserId);

    if (!workspace) {
      throw new NotFoundException('Workspace not found.');
    }

    return await this.db.workspace.update({
      where: { id: workspaceId },
      data: updateWorkspaceDto,
    });
  }

  async findOne(workspaceId: string, signedUserId: string) {
    const workspace = await this.db.workspace.findFirst({
      where: {
        id: workspaceId,
      },
      include: {
        WorkspaceUser: {
          where: {
            userId: signedUserId,
          },
          select: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        Vault: {
          select: { id: true, name: true, description: true },
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found.');
    }

    if (!workspace.WorkspaceUser || !workspace.WorkspaceUser[0]) {
      throw new BadRequestException(
        'The user does not belong to this workspace.',
      );
    }

    const users = workspace.WorkspaceUser.map((user) => user.user);
    const vaults = workspace.Vault.map((password) => password);

    return {
      id: workspace.id,
      name: workspace.name,
      description: workspace.description,
      users,
      vaults,
    };
  }
}
