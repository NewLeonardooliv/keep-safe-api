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
    const passwordEncrypted = this.encryptPassoword(createPasswordDto.password);

    delete createPasswordDto.password;

    const password = await this.db.password.create({
      data: {
        ...createPasswordDto,
        ...passwordEncrypted,
        userId: signedUserId,
      },
    });

    delete password.passwordCrypt;
    delete password.passwordHash;

    return password;
  }

  async save(
    passwordId: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<PasswordPersistence> {
    const passwordEncrypted = this.encryptPassoword(updatePasswordDto.password);

    delete updatePasswordDto.password;

    const password = await this.db.password.update({
      data: {
        ...updatePasswordDto,
        ...passwordEncrypted,
      },
      where: { id: passwordId },
    });

    delete password.passwordCrypt;
    delete password.passwordHash;

    return password;
  }

  async find(id: string, signedUserId: string) {
    const password = await this.db.password.findUnique({
      where: { id },
    });

    if (password.userId !== signedUserId) {
      throw new NotFoundException('Password not found');
    }

    const passwordDecrypt = this.decryptPassoword(password);

    delete password.passwordCrypt;
    delete password.passwordHash;

    return { ...password, password: passwordDecrypt };
  }

  async findAll(signedUserId: string) {
    const passwords = await this.db.password.findMany({
      where: { userId: signedUserId },
    });

    return passwords.map((password: PasswordPersistence) => {
      const passwordDecrypt = this.decryptPassoword(password);

      delete password.passwordCrypt;
      delete password.passwordHash;

      return { ...password, password: passwordDecrypt };
    });
  }

  private decryptPassoword(password: PasswordPersistence) {
    return decrypt(password.passwordCrypt, privateKey, password.passwordHash);
  }

  private encryptPassoword(password: string) {
    const { encryptedData: passwordCrypt, hash: passwordHash } = encryptAndHash(
      password,
      privateKey,
    );

    return {
      passwordCrypt,
      passwordHash,
    };
  }
}
