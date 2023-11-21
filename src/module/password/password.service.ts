import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/database/prisma.service';

@Injectable()
export class PasswordService {
  constructor(private readonly db: PrismaService) {}

  async create() {}
  async save() {}
  async find() {}
  async findAll() {}
}
