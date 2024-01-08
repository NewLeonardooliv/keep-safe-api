import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/guard/jwt.guard';
import { WorkspaceService } from './workspace.service';
import { SignedUser } from 'src/decorators/signed-user.decorator';
import { User as UserPersistence } from '@prisma/client';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@UseGuards(JwtGuard)
@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(@SignedUser() currentUser: UserPersistence) {
    return await this.workspaceService.findAllWorkspaces(currentUser.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @SignedUser() currentUser: UserPersistence,
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ) {
    await this.workspaceService.create(currentUser.id, createWorkspaceDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') vaultId: string,
    @SignedUser() currentUser: UserPersistence,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    await this.workspaceService.update(
      vaultId,
      currentUser.id,
      updateWorkspaceDto,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async find(
    @Param('id') id: string,
    @SignedUser() currentUser: UserPersistence,
  ) {
    return await this.workspaceService.findOne(id, currentUser.id);
  }
}
