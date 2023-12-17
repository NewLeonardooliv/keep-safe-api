import { PrismaService } from 'src/service/database/prisma.service';
import { Module } from '@nestjs/common';
import { VaultController } from './vault.controller';
import { VaultService } from './vault.service';
import { CredencialService } from '../credencial/credencial.service';

@Module({
  controllers: [VaultController],
  providers: [VaultService, PrismaService, CredencialService],
})
export class VaultModule {}
