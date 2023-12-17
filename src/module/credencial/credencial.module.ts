import { PrismaService } from 'src/service/database/prisma.service';
import { CredencialService } from './credencial.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [],
  providers: [CredencialService, PrismaService],
})
export class PasswordModule {}
