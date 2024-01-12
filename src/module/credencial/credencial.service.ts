import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../service/database/prisma.service';
import { UpdateCredencialDto } from './dto/update-credencial.dto';
import { Credencial as CredencialPersistence } from '@prisma/client';
import { CreateCredencialDto } from './dto/create-credencial.dto';
import { privateKey } from '../../config/private-key.config';
import {
  decryptAES,
  encryptAES,
} from '../../helper/encrypt-decrypt-aes.helper';

@Injectable()
export class CredencialService {
  constructor(private readonly db: PrismaService) {}

  async create(
    createPasswordDto: CreateCredencialDto,
  ): Promise<CredencialPersistence> {
    const passwordEncrypted = this.encryptPassoword(createPasswordDto.password);

    delete createPasswordDto.password;

    const password = await this.db.credencial.create({
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
    updatePasswordDto: UpdateCredencialDto,
  ): Promise<CredencialPersistence> {
    const passwordEncrypted = this.encryptPassoword(updatePasswordDto.password);

    delete updatePasswordDto.password;

    const password = await this.db.credencial.update({
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
    const password = await this.db.credencial.findUnique({
      where: { id },
    });

    if (!password) {
      throw new NotFoundException('Password not found');
    }

    const passwordDecrypt = this.decryptPassoword(password);

    delete password.passwordHash;

    return { ...password, password: passwordDecrypt };
  }

  async findAll(passwordIds: string[]) {
    const passwords = await this.db.credencial.findMany({
      where: {
        id: {
          in: passwordIds,
        },
      },
    });

    return passwords.map((password: CredencialPersistence) => {
      const passwordDecrypt = this.decryptPassoword(password);

      delete password.passwordHash;

      return { ...password, password: passwordDecrypt };
    });
  }

  private decryptPassoword(password: CredencialPersistence) {
    return decryptAES(password.passwordHash, privateKey());
  }

  private encryptPassoword(password: string) {
    const passwordHash = encryptAES(password, privateKey());

    return {
      passwordHash,
    };
  }
}
