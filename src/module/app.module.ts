import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PasswordModule } from './password/password.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { APP_PIPE } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [AuthModule, PasswordModule, UserModule, WorkspaceModule],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
