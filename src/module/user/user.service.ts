import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/service/database/prisma.service';
import {
  DEFAULT_QUERY_SKIP,
  DEFAULT_QUERY_TAKE,
} from 'src/constants/query.constant';
import { PaginatedResponse } from 'src/types/paginated-response.type';

@Injectable()
export class UserService {
  constructor(private readonly db: PrismaService) {}

  async me(userId: string) {
    const user = await this.db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async list(search?: string, skip?: number, take?: number) {
    const whereCondition = {
      OR: [{ email: { contains: search } }, { name: { contains: search } }],
    };
    const users = await this.db.user.findMany({
      where: whereCondition,
      select: { id: true, email: true, name: true },
      skip: !skip ? DEFAULT_QUERY_SKIP : Number(skip),
      take: !take ? DEFAULT_QUERY_TAKE : Number(take),
    });

    const count = await this.db.user.count({ where: whereCondition });

    return {
      count,
      result: users,
    } satisfies PaginatedResponse<typeof users>;
  }
}
