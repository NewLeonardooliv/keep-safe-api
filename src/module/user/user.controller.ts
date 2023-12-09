import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignedUser } from 'src/decorators/signed-user.decorator';
import { User as UserPersistence } from '@prisma/client';
import { JwtGuard } from 'src/guard/jwt.guard';

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
}
