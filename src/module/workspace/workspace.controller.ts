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
import { User as UserPersistence } from '@prisma/client';
import { SignedUser } from 'src/decorators/signed-user.decorator';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { JwtGuard } from 'src/guard/jwt.guard';
import { CreatePasswordDto } from '../password/dto/create-password.dto';

@UseGuards(JwtGuard)
@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  list(@SignedUser() currentUser: UserPersistence) {
    return this.workspaceService.findAllWorkspaces(currentUser.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  find(@Param('id') id: string, @SignedUser() currentUser: UserPersistence) {
    return this.workspaceService.findOne(id, currentUser.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @SignedUser() currentUser: UserPersistence,
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ) {
    this.workspaceService.create(currentUser.id, createWorkspaceDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') workspaceId: string,
    @SignedUser() currentUser: UserPersistence,
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ) {
    this.workspaceService.update(
      workspaceId,
      currentUser.id,
      createWorkspaceDto,
    );
  }

  @Post(':id/password')
  @HttpCode(HttpStatus.CREATED)
  addPassword(
    @Param('id') workspaceId: string,
    @SignedUser() currentUser: UserPersistence,
    @Body() createPasswordDto: CreatePasswordDto,
  ) {
    this.workspaceService.createPassword(
      workspaceId,
      currentUser.id,
      createPasswordDto,
    );
  }

  @Put(':id/password/:passwordId')
  @HttpCode(HttpStatus.CREATED)
  updatePassword(
    @Param('id') workspaceId: string,
    @Param('passwordId') passwordId: string,
    @SignedUser() currentUser: UserPersistence,
    @Body() createPasswordDto: CreatePasswordDto,
  ) {
    this.workspaceService.updatePassword(
      workspaceId,
      passwordId,
      currentUser.id,
      createPasswordDto,
    );
  }
}
