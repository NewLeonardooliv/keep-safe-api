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
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ZodValidationPipe } from 'nestjs-zod';

@UseGuards(JwtGuard)
@Controller('password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe())
  create(@Body() createPassworDto: CreatePasswordDto) {
    return this.passwordService.create(createPassworDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  list() {
    return this.passwordService.findAll(['1']);
  }

  @Get(':id')
  @HttpCode(HttpStatus.FOUND)
  find(@Param('id') id: string) {
    return this.passwordService.find(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Body() updatePassworDto: UpdatePasswordDto, @Param('id') id: string) {
    return this.passwordService.save(id, updatePassworDto);
  }
}
