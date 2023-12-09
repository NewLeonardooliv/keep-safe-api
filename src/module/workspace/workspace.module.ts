import { PrismaService } from 'src/service/database/prisma.service';
import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { PasswordService } from '../password/password.service';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService, PrismaService, PasswordService],
})
export class WorkspaceModule {}
