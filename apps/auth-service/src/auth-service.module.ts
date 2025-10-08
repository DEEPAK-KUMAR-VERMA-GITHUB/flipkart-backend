import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth-service.service";
import { JwtStrategy } from "@app/auth/strategies/jwt.strategy";
import { AuthServiceController } from "./auth-service.controller";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({}), // options set in service
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthServiceController],
  exports: [AuthService],
})
export class AuthModule { }
