import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PasswordModule } from './credencial/credencial.module';
import { UserModule } from './user/user.module';
import { VaultModule } from './vault/vault.module';
import { ThrottlerModule } from '@nestjs/throttler';
import {
  THROTTLER_PROVIDER,
  ZOD_PROVIDER,
} from 'src/constants/providers.constant';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [
    AuthModule,
    PasswordModule,
    UserModule,
    WorkspaceModule,
    VaultModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 50,
      },
    ]),
  ],
  controllers: [],
  providers: [ZOD_PROVIDER, THROTTLER_PROVIDER],
})
export class AppModule {}
