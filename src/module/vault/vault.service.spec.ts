import { VaultService } from './vault.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CredencialService } from '../credencial/credencial.service';
import { PrismaService } from '../../service/database/prisma.service';
import { CreateVaultDto } from './dto/create-vault.dto';
import { prismaMethods } from '../../helper/prisma-methods-to-mock.helper';

describe('VaultService', () => {
  let vaultService: VaultService;
  let prismaServiceMock: Partial<PrismaService>;
  const credencialServiceMock: Partial<CredencialService> = {};

  beforeEach(() => {
    prismaServiceMock = {
      user: prismaMethods,
      vault: prismaMethods,
      vaultUser: prismaMethods,
    };

    vaultService = new VaultService(
      prismaServiceMock as PrismaService,
      credencialServiceMock as CredencialService,
    );
  });

  describe('create', () => {
    it('should throw NotFoundException if user not found', async () => {
      const ownerId = 'non-existing-user-id';
      const createVaultDto = new CreateVaultDto();

      prismaServiceMock.user.findFirst = jest.fn().mockReturnValue(null);

      await expect(
        vaultService.create(ownerId, createVaultDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should create a vault', async () => {
      const ownerId = 'existing-user-id';
      const createVaultDto = new CreateVaultDto();
      const mockVault = { id: 'vault-id', ...createVaultDto, ownerId };

      prismaServiceMock.user.findFirst = jest
        .fn()
        .mockResolvedValue({ id: ownerId });
      prismaServiceMock.vault.create = jest.fn().mockResolvedValue(mockVault);
      prismaServiceMock.vaultUser.create = jest
        .fn()
        .mockResolvedValue(mockVault);

      const result = await vaultService.create(ownerId, createVaultDto);

      expect(result).toEqual(mockVault);
      expect(prismaServiceMock.vault.create).toHaveBeenCalledWith({
        data: { ...createVaultDto, ownerId },
      });
      expect(prismaServiceMock.vaultUser.create).toHaveBeenCalledWith({
        data: { userId: ownerId, vaultId: mockVault.id },
      });
    });
  });

  describe('find', () => {
    it('should find all vaults', async () => {
      const signedUserId = 'existing-user-id';
      const createVaultDto = new CreateVaultDto();

      const mockVault = [
        { ...createVaultDto },
        { ...createVaultDto },
        { ...createVaultDto },
      ];
      prismaServiceMock.user.findMany = jest.fn().mockReturnValue(mockVault);

      expect(await vaultService.findAllVaults(signedUserId)).toBe(mockVault);
    });

    it('should find a vault', async () => {
      const signedUserId = 'existing-user-id';
      const vaultId = 'existing-vault-id';
      const createVaultDto = {
        name: 'name-vault-test',
        description: 'description-vault-test',
      };

      prismaServiceMock.user.findFirst = jest.fn().mockReturnValue({
        id: vaultId,
        ...createVaultDto,
        ownerId: signedUserId,
        VaultUser: [{ user: {} }],
        Credencial: [],
      });

      const sholdResult = {
        id: vaultId,
        ...createVaultDto,
        ownerId: signedUserId,
        users: [{}],
        credencials: [],
      };

      expect(await vaultService.findOne(vaultId, signedUserId)).toStrictEqual(
        sholdResult,
      );
    });

    it('should throw a BadRequestException if the user is not in the vault', async () => {
      const signedUserId = 'existing-user-id';
      const vaultId = 'existing-vault-id';
      const createVaultDto = {
        name: 'name-vault-test',
        description: 'description-vault-test',
      };

      prismaServiceMock.user.findFirst = jest.fn().mockReturnValue({
        id: vaultId,
        ...createVaultDto,
        ownerId: signedUserId,
        VaultUser: [],
        Credencial: [],
      });

      await expect(vaultService.findOne(vaultId, signedUserId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
