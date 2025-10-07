import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserServiceService } from './user-service.service';

@Controller('users')
export class UserServiceController {
  constructor(private readonly userService: UserServiceService) {}

  // @UseGuards()
  @Get('profile')
  async getProfile(@Request() req) {
    return this.userService.findById(req.user.userId);
  }
}
