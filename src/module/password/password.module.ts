import { PrismaService } from 'src/service/database/prisma.service';
import { PasswordController } from './password.controller';
import { PasswordService } from './password.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [PasswordController],
  providers: [PasswordService, PrismaService],
})
export class PasswordModule {}
