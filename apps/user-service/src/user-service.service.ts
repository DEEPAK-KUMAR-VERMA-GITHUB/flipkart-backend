import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';
import { PrismaService } from 'libs/prisma/prisma.service';

@Injectable()
export class UserServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async createUser(data: PrismaService['user']['create']['arguments']['data']): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }
}
