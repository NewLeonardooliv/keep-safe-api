import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/service/database/prisma.service';
import { PasswordService } from '../password/password.service';
import { CreatePasswordDto } from '../password/dto/create-password.dto';
import { UserPassword as UserPasswordPersistence } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly db: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async me(userId: string) {
    const user = await this.db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async allUserPassword(userId: string) {
    const userPasswords = await this.db.userPassword.findMany({
      where: {
        userId: userId,
      },
    });

    const passwordToFind = userPasswords.map(
      (userPassword: UserPasswordPersistence) => userPassword.passwordId,
    );

    const passwords = await this.passwordService.findAll(passwordToFind);

    return passwords;
  }

  async createUserPassword(
    createPasswordDto: CreatePasswordDto,
    userId: string,
  ) {
    const passwordCreated =
      await this.passwordService.create(createPasswordDto);

    await this.db.userPassword.create({
      data: {
        passwordId: passwordCreated.id,
        userId: userId,
      },
    });
  }
}
