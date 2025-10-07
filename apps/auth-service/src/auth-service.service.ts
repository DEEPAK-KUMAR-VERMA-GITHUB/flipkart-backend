import { PrismaService } from '@app/prisma';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'generated/prisma';
import * as bcrypt from 'bcryptjs';
import { addDays } from 'date-fns';
import { LoginDto, RefreshTokenDto, RegisterDto } from '@app/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) { }

  private async signAccessToken(user: Partial<User>) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };

    const secret = this.config.get<string>('JWT_ACCESS_SECRET');
    const expiresIn = this.config.get<string>('JWT_ACCESS_EXPIRES_IN');

    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
  }

  private async signRefreshToken(user: { id: number }) {
    const payload = {
      sub: user.id,
      type: 'refresh',
    };

    const secret = this.config.get<string>('JWT_REFRESH_SECRET');
    const expiresIn = this.config.get<string>('JWT_REFRESH_EXPIRES_IN');
    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
  }

  private async persistRefreshToken(
    userId: number,
    refreshToken: string,
    ip?: string,
    ua?: string,
  ) {
    const tokenHash = await bcrypt.hash(refreshToken, 12);
    const days = parseInt(this.config.get<string>('JWT_REFRESH_EXPIRES_IN')!.split('d')[0], 10);

    const expiresAt = addDays(new Date(), days);
    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        ipAddress: ip,
        userAgent: ua,
        expiresAt,
      },
    });
  }

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (exists) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        ...dto,
        passwordHash: passwordHash,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });

    const accessToken = await this.signAccessToken(user);
    const refreshToken = await this.signRefreshToken(user);

    await this.persistRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN'),
      user,
    };
  }

  async login(dto: LoginDto, ip?: string, ua?: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatched = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const safe = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt,
    };

    const accessToken = await this.signAccessToken(safe);
    const refreshToken = await this.signRefreshToken(safe);

    await this.persistRefreshToken(user.id, refreshToken, ip, ua);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN'),
      user: safe,
    };
  }

  async refresh(dto: RefreshTokenDto) {
    try {
      const payload = await this.jwtService.verifyAsync<{ sub: number; type: string }>(
        dto.refreshToken,
        {
          secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        },
      );

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      // validate against stored hashes
      const tokens = await this.prisma.refreshToken.findMany({
        where: {
          userId: payload.sub,
          revokedAt: null,
          expiresAt: {
            gt: new Date(),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      });

      const match = await this.findMatchingToken(dto.refreshToken, tokens);

      if (!match) {
        throw new UnauthorizedException('Refresh token invalid or expired');
      }

      // Rotate : revoke current and issue new
      await this.prisma.refreshToken.update({
        where: {
          id: match.id,
        },
        data: {
          revokedAt: new Date(),
        },
      });

      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.sub,
        },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const accessToken = await this.signAccessToken(user);
      const refreshToken = await this.signRefreshToken(user);

      await this.persistRefreshToken(user.id, refreshToken);

      return {
        accessToken,
        refreshToken,
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'),
        user,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async findMatchingToken(raw: string, stored: { id: number; tokenHash: string }[]) {
    for (const token of stored) {
      const match = await bcrypt.compare(raw, token.tokenHash);
      if (match) return token;
    }
    return null;
  }

  async revokeAllForUser(userId: number) {
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}
