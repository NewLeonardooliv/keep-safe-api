import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConfig } from 'src/config/jwt.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/service/database/prisma.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { VaultService } from '../vault/vault.service';
import { CredencialService } from '../credencial/credencial.service';
import { WorkspaceService } from '../workspace/workspace.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    JwtStrategy,
    VaultService,
    CredencialService,
    WorkspaceService,
  ],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConfig().jwtSecret,
      signOptions: { expiresIn: jwtConfig().jwtExpiresIn },
    }),
  ],
})
export class AuthModule {}
