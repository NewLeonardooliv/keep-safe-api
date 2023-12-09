import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { User as UserPersistence } from '@prisma/client';
import { SignedUser } from 'src/decorators/signed-user.decorator';
import { VaultService } from './vault.service';
import { CreateVaultDto } from './dto/create-vault.dto';
import { JwtGuard } from 'src/guard/jwt.guard';
import { CreatePasswordDto } from '../password/dto/create-password.dto';

@UseGuards(JwtGuard)
@Controller('vault')
export class VaultController {
  constructor(private readonly vaultService: VaultService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(@SignedUser() currentUser: UserPersistence) {
    return await this.vaultService.findAllVaults(currentUser.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async find(
    @Param('id') id: string,
    @SignedUser() currentUser: UserPersistence,
  ) {
    return await this.vaultService.findOne(id, currentUser.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @SignedUser() currentUser: UserPersistence,
    @Body() createVaultDto: CreateVaultDto,
  ) {
    await this.vaultService.create(currentUser.id, createVaultDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') vaultId: string,
    @SignedUser() currentUser: UserPersistence,
    @Body() createVaultDto: CreateVaultDto,
  ) {
    await this.vaultService.update(vaultId, currentUser.id, createVaultDto);
  }

  @Post(':id/password')
  @HttpCode(HttpStatus.CREATED)
  async addPassword(
    @Param('id') vaultId: string,
    @SignedUser() currentUser: UserPersistence,
    @Body() createPasswordDto: CreatePasswordDto,
  ) {
    await this.vaultService.createPassword(
      vaultId,
      currentUser.id,
      createPasswordDto,
    );
  }

  @Put(':id/password/:passwordId')
  @HttpCode(HttpStatus.CREATED)
  async updatePassword(
    @Param('id') vaultId: string,
    @Param('passwordId') passwordId: string,
    @SignedUser() currentUser: UserPersistence,
    @Body() createPasswordDto: CreatePasswordDto,
  ) {
    await this.vaultService.updatePassword(
      vaultId,
      passwordId,
      currentUser.id,
      createPasswordDto,
    );
  }

  @Get(':id/password/:passwordId')
  @HttpCode(HttpStatus.OK)
  async findPassword(
    @Param('id') vaultId: string,
    @Param('passwordId') passwordId: string,
    @SignedUser() currentUser: UserPersistence,
  ) {
    return await this.vaultService.findPassword(
      vaultId,
      passwordId,
      currentUser.id,
    );
  }
}
