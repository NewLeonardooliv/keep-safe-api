import { PrismaService } from 'src/service/database/prisma.service';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CredencialService } from '../credencial/credencial.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, CredencialService],
})
export class UserModule {}
