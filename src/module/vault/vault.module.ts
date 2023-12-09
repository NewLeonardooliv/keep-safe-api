import { PrismaService } from 'src/service/database/prisma.service';
import { Module } from '@nestjs/common';
import { VaultController } from './vault.controller';
import { VaultService } from './vault.service';
import { PasswordService } from '../password/password.service';

@Module({
  controllers: [VaultController],
  providers: [VaultService, PrismaService, PasswordService],
})
export class VaultModule {}
