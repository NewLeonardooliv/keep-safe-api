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
import { CreateCredencialDto } from '../credencial/dto/create-credencial.dto';
import { UpdateCredencialDto } from '../credencial/dto/update-credencial.dto';

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
    return await this.vaultService.create(currentUser.id, createVaultDto);
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

  @Post(':id/credencial')
  @HttpCode(HttpStatus.CREATED)
  async addPassword(
    @Param('id') vaultId: string,
    @SignedUser() currentUser: UserPersistence,
    @Body() createPasswordDto: CreateCredencialDto,
  ) {
    await this.vaultService.createPassword(
      vaultId,
      currentUser.id,
      createPasswordDto,
    );
  }

  @Put(':id/credencial/:credencialId')
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @Param('id') vaultId: string,
    @Param('credencialId') credencialId: string,
    @SignedUser() currentUser: UserPersistence,
    @Body() updatePasswordDto: UpdateCredencialDto,
  ) {
    await this.vaultService.updatePassword(
      vaultId,
      credencialId,
      currentUser.id,
      updatePasswordDto,
    );
  }

  @Get(':id/credencial/:credencialId')
  @HttpCode(HttpStatus.OK)
  async findPassword(
    @Param('id') vaultId: string,
    @Param('credencialId') credencialId: string,
    @SignedUser() currentUser: UserPersistence,
  ) {
    return await this.vaultService.findPassword(
      vaultId,
      credencialId,
      currentUser.id,
    );
  }
}
