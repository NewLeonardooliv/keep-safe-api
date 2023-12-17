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

@Module({
  imports: [
    AuthModule,
    PasswordModule,
    UserModule,
    VaultModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
  controllers: [],
  providers: [ZOD_PROVIDER, THROTTLER_PROVIDER],
})
export class AppModule {}
