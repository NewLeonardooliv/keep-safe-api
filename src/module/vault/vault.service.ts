import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Password as PasswordPesistence,
  Vault as VaultPesistence,
  VaultUser as VaultUserPesistence,
} from '@prisma/client';
import { PrismaService } from 'src/service/database/prisma.service';
import { CreateVaultDto } from './dto/create-vault.dto';
import { PasswordService } from '../password/password.service';
import { CreatePasswordDto } from '../password/dto/create-password.dto';
import { UpdatePasswordDto } from '../password/dto/update-password.dto';
import { UpdateVaultDto } from './dto/update-vault.dto';

@Injectable()
export class VaultService {
  constructor(
    private readonly db: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async findAllVaults(signedUserId: string) {
    const vaultsUsers = await this.db.vaultUser.findMany({
      where: {
        userId: signedUserId,
      },
    });

    const vaultUsersToFind = vaultsUsers.map(
      (vaultsUser: VaultUserPesistence) => vaultsUser.vaultId,
    );

    const vaults = await this.findAll(vaultUsersToFind);

    return vaults;
  }

  async findAll(vaultIds: string[]): Promise<VaultPesistence[]> {
    const vaults = await this.db.vault.findMany({
      where: {
        id: {
          in: vaultIds,
        },
      },
    });

    return vaults;
  }

  async addUser(
    userId: string,
    vaultId: string,
    signedUserId: string,
  ): Promise<VaultUserPesistence> {
    const vault = await this.findOne(vaultId, signedUserId);

    if (!vault) {
      throw new NotFoundException('Vault not found.');
    }

    if (vault.ownerId != signedUserId) {
      throw new BadRequestException('Only owners can add users to this vault.');
    }

    return await this.db.vaultUser.create({
      data: {
        userId,
        vaultId,
      },
    });
  }

  async createPassword(
    vaultId: string,
    signedUserId: string,
    createPasswordDto: CreatePasswordDto,
  ): Promise<PasswordPesistence> {
    const vault = await this.findOne(vaultId, signedUserId);

    if (!vault) {
      throw new NotFoundException('Vault not found.');
    }

    if (vault.ownerId != signedUserId) {
      throw new BadRequestException(
        'Only owners can add password to this vault.',
      );
    }

    const password = await this.passwordService.create({
      ...createPasswordDto,
      vaultId,
    });

    return password;
  }

  async updatePassword(
    vaultId: string,
    passwordId: string,
    signedUserId: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<PasswordPesistence> {
    const vault = await this.findOne(vaultId, signedUserId);

    if (!vault) {
      throw new NotFoundException('Vault not found.');
    }

    if (vault.ownerId != signedUserId) {
      throw new BadRequestException(
        'Only owners can update password on this vault.',
      );
    }

    const password = await this.passwordService.save(
      passwordId,
      updatePasswordDto,
    );

    return password;
  }

  async create(
    ownerId: string,
    createVaultDto: CreateVaultDto,
  ): Promise<VaultPesistence> {
    const vault = await this.db.vault.create({
      data: {
        ...createVaultDto,
        ownerId,
      },
    });

    await this.db.vaultUser.create({
      data: {
        userId: ownerId,
        vaultId: vault.id,
      },
    });

    return vault;
  }

  async update(
    vaultId: string,
    signedUserId: string,
    updateVaultDto: UpdateVaultDto,
  ): Promise<VaultPesistence> {
    const vault = await this.findOne(vaultId, signedUserId);

    if (!vault) {
      throw new NotFoundException('Vault not found.');
    }

    if (vault.ownerId != signedUserId) {
      throw new BadRequestException('Only owners can update this vault.');
    }

    await this.db.vault.update({
      where: { id: vaultId },
      data: {
        ...updateVaultDto,
      },
    });

    return vault;
  }

  async findOne(vaultId: string, signedUserId: string) {
    const vault = await this.db.vault.findFirst({
      where: {
        id: vaultId,
      },
      include: {
        VaultUser: {
          where: {
            userId: signedUserId,
          },
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        Password: {
          select: {
            id: true,
            title: true,
            username: true,
          },
        },
      },
    });

    if (!vault) {
      throw new NotFoundException('Vault not found.');
    }

    if (!vault.VaultUser || !vault.VaultUser[0]) {
      throw new BadRequestException('The user does not belong to this vault.');
    }

    const users = vault.VaultUser.map((user) => user.user);
    const passwords = vault.Password.map((password) => password);

    return {
      id: vault.id,
      name: vault.name,
      ownerId: vault.ownerId,
      users,
      passwords,
    };
  }

  async findPassword(
    vaultId: string,
    passwordId: string,
    signedUserId: string,
  ) {
    await this.findOne(vaultId, signedUserId);

    return await this.passwordService.find(passwordId);
  }
}
