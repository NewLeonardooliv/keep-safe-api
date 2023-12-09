import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/database/prisma.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Password as PasswordPersistence } from '@prisma/client';
import { CreatePasswordDto } from './dto/create-password.dto';
import { privateKey } from 'src/config/private-key.config';
import {
  decryptAES,
  encryptAES,
} from 'src/helper/encrypt-decrypt-aes.helper copy';

@Injectable()
export class PasswordService {
  constructor(private readonly db: PrismaService) {}

  async create(
    createPasswordDto: CreatePasswordDto,
  ): Promise<PasswordPersistence> {
    const passwordEncrypted = this.encryptPassoword(createPasswordDto.password);

    delete createPasswordDto.password;

    const password = await this.db.password.create({
      data: {
        ...createPasswordDto,
        ...passwordEncrypted,
      },
    });

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

    delete password.passwordHash;

    return password;
  }

  async find(id: string) {
    const password = await this.db.password.findUnique({
      where: { id },
    });

    const passwordDecrypt = this.decryptPassoword(password);

    delete password.passwordHash;

    return { ...password, password: passwordDecrypt };
  }

  async findAll(passwordIds: string[]) {
    const passwords = await this.db.password.findMany({
      where: {
        id: {
          in: passwordIds,
        },
      },
    });

    return passwords.map((password: PasswordPersistence) => {
      const passwordDecrypt = this.decryptPassoword(password);

      delete password.passwordHash;

      return { ...password, password: passwordDecrypt };
    });
  }

  private decryptPassoword(password: PasswordPersistence) {
    return decryptAES(password.passwordHash, privateKey);
  }

  private encryptPassoword(password: string) {
    const passwordHash = encryptAES(password, privateKey);

    return {
      passwordHash,
    };
  }
}
