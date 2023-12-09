import { PrismaService } from 'src/service/database/prisma.service';
import { PasswordService } from './password.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [],
  providers: [PasswordService, PrismaService],
})
export class PasswordModule {}
