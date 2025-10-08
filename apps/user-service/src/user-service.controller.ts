import { CurrentUser, JwtAuthGuard } from '@app/auth';
import { PrismaService } from '@app/prisma';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserServiceService } from './user-service.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserServiceController {
  constructor(private readonly userService: UserServiceService, private readonly prisma: PrismaService) { }

  // @UseGuards()
  @Get('profile')
  async profile(@CurrentUser() user: { userId: number }) {
    const registeredUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true
      }
    })
    return registeredUser;
  }
}
