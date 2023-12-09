import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Password as PasswordPesistence,
  Workspace as WorkspacePesistence,
  WorkspaceUser as WorkspaceUserPesistence,
} from '@prisma/client';
import { PrismaService } from 'src/service/database/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { PasswordService } from '../password/password.service';
import { CreatePasswordDto } from '../password/dto/create-password.dto';
import { UpdatePasswordDto } from '../password/dto/update-password.dto';

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly db: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async findAllWorkspaces(signedUserId: string) {
    const workspacesUsers = await this.db.workspaceUser.findMany({
      where: {
        userId: signedUserId,
      },
    });

    const workspacesUsersToFind = workspacesUsers.map(
      (workspacesUser: WorkspaceUserPesistence) => workspacesUser.workspaceId,
    );

    const workspaces = await this.findAll(workspacesUsersToFind);

    return workspaces;
  }

  async findAll(workspaceIds: string[]): Promise<WorkspacePesistence[]> {
    const workspaces = await this.db.workspace.findMany({
      where: {
        id: {
          in: workspaceIds,
        },
      },
    });

    return workspaces;
  }

  async addUser(
    userId: string,
    workspaceId: string,
    signedUserId: string,
  ): Promise<WorkspaceUserPesistence> {
    const workspace = await this.findOne(workspaceId, signedUserId);

    if (!workspace) {
      throw new NotFoundException('Workspace not found.');
    }

    if (workspace.ownerId != signedUserId) {
      throw new BadRequestException(
        'Only owners can add users to this workspace.',
      );
    }

    return await this.db.workspaceUser.create({
      data: {
        userId,
        workspaceId,
      },
    });
  }

  async createPassword(
    workspaceId: string,
    signedUserId: string,
    createPasswordDto: CreatePasswordDto,
  ): Promise<PasswordPesistence> {
    const workspace = await this.findOne(workspaceId, signedUserId);

    if (!workspace) {
      throw new NotFoundException('Workspace not found.');
    }

    if (workspace.ownerId != signedUserId) {
      throw new BadRequestException(
        'Only owners can add password to this workspace.',
      );
    }

    const password = await this.passwordService.create(createPasswordDto);

    await this.db.workspacePassword.create({
      data: {
        workspaceId,
        passwordId: password.id,
      },
    });

    return password;
  }

  async updatePassword(
    workspaceId: string,
    passwordId: string,
    signedUserId: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<PasswordPesistence> {
    const workspace = await this.findOne(workspaceId, signedUserId);

    if (!workspace) {
      throw new NotFoundException('Workspace not found.');
    }

    if (workspace.ownerId != signedUserId) {
      throw new BadRequestException(
        'Only owners can update password on this workspace.',
      );
    }

    const password = await this.passwordService.save(
      passwordId,
      updatePasswordDto,
    );

    return password;
  }

  async create(
    ownerId: string,
    createWorkspaceDto: CreateWorkspaceDto,
  ): Promise<WorkspacePesistence> {
    const workspace = await this.db.workspace.create({
      data: {
        ...createWorkspaceDto,
        ownerId,
      },
    });

    await this.addUser(ownerId, workspace.id, ownerId);

    return workspace;
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
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        WorkspacePassword: {
          select: {
            password: {
              select: {
                id: true,
                title: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found.');
    }

    if (!workspace.WorkspaceUser.length) {
      throw new BadRequestException(
        'The user does not belong to this workspace.',
      );
    }

    const users = workspace.WorkspaceUser.map((user) => user.user);
    const passwords = workspace.WorkspacePassword.map(
      (password) => password.password,
    );

    return {
      id: workspace.id,
      name: workspace.name,
      ownerId: workspace.ownerId,
      users,
      passwords,
    };
  }
}
