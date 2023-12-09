import { PrismaService } from 'src/service/database/prisma.service';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PasswordService } from '../password/password.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, PasswordService],
})
export class UserModule {}
