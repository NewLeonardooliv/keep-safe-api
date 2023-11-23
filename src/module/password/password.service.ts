import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/service/database/prisma.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Password as PasswordPersistence } from '@prisma/client';
import { CreatePasswordDto } from './dto/create-password.dto';
import { privateKey } from 'src/config/private-key.config';
import { decrypt, encryptAndHash } from 'src/helper/encrypt-decrypt.helper';

@Injectable()
export class PasswordService {
  constructor(private readonly db: PrismaService) {}

  async create(
    createPasswordDto: CreatePasswordDto,
    signedUserId: string,
  ): Promise<PasswordPersistence> {
    const { encryptedData: passwordCrypt, hash: passwordHash } = encryptAndHash(
      createPasswordDto.password,
      privateKey,
    );

    delete createPasswordDto.password;

    const password = await this.db.password.create({
      data: {
        ...createPasswordDto,
        passwordHash,
        passwordCrypt,
        userId: signedUserId,
      },
    });

    return password;
  }

  async save(
    passwordId: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<PasswordPersistence> {
    const { encryptedData: passwordCrypt, hash: passwordHash } = encryptAndHash(
      updatePasswordDto.password,
      privateKey,
    );

    const password = await this.db.password.update({
      data: {
        ...updatePasswordDto,
        passwordHash,
        passwordCrypt,
      },
      where: { id: passwordId },
    });

    return password;
  }

  async find(id: string, signedUserId: string) {
    const password = await this.db.password.findUnique({
      where: { id },
    });

    if (password.userId !== signedUserId) {
      throw new NotFoundException('Password not found');
    }
    const passwordDecrypt = decrypt(
      password.passwordCrypt,
      privateKey,
      password.passwordHash,
    );

    delete password.passwordCrypt;
    delete password.passwordHash;

    return { ...password, password: passwordDecrypt };
  }

  async findAll(signedUserId: string) {
    const passwords = await this.db.password.findMany({
      where: { userId: signedUserId },
    });

    return passwords.map((password: PasswordPersistence) => {
      const passwordDecrypt = decrypt(
        password.passwordCrypt,
        privateKey,
        password.passwordHash,
      );

      delete password.passwordCrypt;
      delete password.passwordHash;

      return { ...password, password: passwordDecrypt };
    });
  }
}
