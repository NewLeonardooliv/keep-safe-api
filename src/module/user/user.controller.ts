import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignedUser } from 'src/decorators/signed-user.decorator';
import { User as UserPersistence } from '@prisma/client';
import { JwtGuard } from 'src/guard/jwt.guard';
import { CreatePasswordDto } from '../password/dto/create-password.dto';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  me(@SignedUser() user: UserPersistence) {
    return this.userService.me(user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  list(
    @Query('search') search?: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.userService.list(search, skip, take);
  }

  @Get('password')
  @HttpCode(HttpStatus.OK)
  listPasswords(@SignedUser() user: UserPersistence) {
    return this.userService.allUserPassword(user.id);
  }

  @Post('password')
  @HttpCode(HttpStatus.CREATED)
  createPassword(
    @Body() createPassworDto: CreatePasswordDto,
    @SignedUser() user: UserPersistence,
  ) {
    return this.userService.createUserPassword(createPassworDto, user.id);
  }
}
