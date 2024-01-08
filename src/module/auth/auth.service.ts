import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { SigninAuthDto } from './dto/signin-auth.dto';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { PrismaService } from 'src/service/database/prisma.service';
import { encriptPassword, verifyPassword } from 'src/helper/password.helper';
import { VaultService } from '../vault/vault.service';
import { VAULT } from 'src/constants/first-vault.constant';
import { WorkspaceService } from '../workspace/workspace.service';
import { WORKSPACE } from 'src/constants/first-workspace.constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: PrismaService,
    private readonly jwtService: JwtService,
    private readonly vaultService: VaultService,
    private readonly workspaceService: WorkspaceService,
  ) {}

  private async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.db.user.findFirst({ where: { email } });

    if (!user) {
      return null;
    }

    if (!(await verifyPassword(password, user.password))) {
      return null;
    }

    return user;
  }

  async signin(signinAuthDto: SigninAuthDto) {
    const user = await this.validateUserCredentials(
      signinAuthDto.email,
      signinAuthDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('email or password is invalid.');
    }

    return {
      token: this.jwtService.sign(user),
    };
  }

  async signup({
    name,
    email,
    password,
  }: SignupAuthDto): Promise<{ token: string }> {
    if (
      await this.db.user.findUnique({
        where: { email },
      })
    ) {
      throw new BadRequestException('A user already uses this email');
    }

    const hashedPassword = await encriptPassword(password);
    const user = await this.db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const workspace = await this.workspaceService.create(user.id, WORKSPACE);

    await this.vaultService.create(user.id, {
      ...VAULT,
      workspaceId: workspace.id,
    });

    return { token: this.jwtService.sign(user) };
  }
}
