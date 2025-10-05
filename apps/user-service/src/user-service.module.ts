import { Module } from '@nestjs/common';
import { UserServiceController } from './user-service.controller';
import { UserServiceService } from './user-service.service';
import { PrismaModule } from 'libs/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserServiceController],
  providers: [UserServiceService],
})
export class UserServiceModule {


}
