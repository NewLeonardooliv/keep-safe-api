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
  UsePipes,
} from '@nestjs/common';
import { PasswordService } from './password.service';
import { CreatePasswordDto } from './dto/create-password.dto';
import { JwtGuard } from 'src/guard/jwt.guard';
import { User as UserPersistence } from '@prisma/client';
import { SignedUser } from 'src/decorators/signed-user.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ZodValidationPipe } from 'nestjs-zod';

@UseGuards(JwtGuard)
@Controller('password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe())
  create(
    @Body() createPassworDto: CreatePasswordDto,
    @SignedUser() currentUser: UserPersistence,
  ) {
    return this.passwordService.create(createPassworDto, currentUser.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  list(@SignedUser() currentUser: UserPersistence) {
    return this.passwordService.findAll(currentUser.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.FOUND)
  find(@Param('id') id: string, @SignedUser() currentUser: UserPersistence) {
    return this.passwordService.find(id, currentUser.id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Body() updatePassworDto: UpdatePasswordDto, @Param('id') id: string) {
    return this.passwordService.save(id, updatePassworDto);
  }
}
