import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserPrismaRepository } from '@infra/persistence/repositories/user.prisma.repository';
import type {
  GoogleAuthProfile,
  IAuthPort,
  MinimalUser,
} from '@app/ports/auth.port';

@Injectable()
export class AuthService implements IAuthPort {
  constructor(
    private users: UserPrismaRepository,
    private jwt: JwtService,
  ) {}

  async validateGoogleUser(
    googleUser: GoogleAuthProfile,
  ): Promise<MinimalUser | null> {
    let user = await this.users.findByProviderId(
      'google',
      googleUser.providerAccountId,
    );

    if (!user) {
      user = await this.users.createFromGoogleProfile({
        email: googleUser.email,
        name: googleUser.name,
        image: googleUser.image,
        providerAccountId: googleUser.providerAccountId,
        accessToken: googleUser.accessToken,
        refreshToken: googleUser.refreshToken,
      });
    }

    return user;
  }

  async login(user: {
    id: string;
    email?: string;
  }): Promise<{ access_token: string }> {
    const payload = { sub: user.id, email: user.email ?? undefined };
    const access_token = await this.jwt.signAsync(payload);
    return { access_token };
  }

  me(userId: string) {
    return this.users.findById(userId);
  }

  get postLoginRedirect(): string {
    const baseFront =
      process.env.FRONTEND_PUBLIC_URL || 'http://localhost:3000';
    return `${baseFront}/bookings`;
  }

  setSessionCookie(res: Response, token: string): void {
    if (!token) throw new UnauthorizedException('Token generation failed');

    const isProd = process.env.NODE_ENV === 'production';
    const cookieName = process.env.SESSION_COOKIE_NAME || 'jwt';
    const maxAge = Number(process.env.SESSION_COOKIE_MAX_AGE_MS || 86400000);

    res.cookie(cookieName, token, {
      httpOnly: true,
      path: '/',
      maxAge,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      ...(isProd && process.env.SESSION_COOKIE_DOMAIN
        ? { domain: process.env.SESSION_COOKIE_DOMAIN }
        : {}),
    });
  }

  logout(res: Response): void {
    const cookieName = process.env.SESSION_COOKIE_NAME || 'jwt';
    const isProd = process.env.NODE_ENV === 'production';
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      ...(isProd && process.env.SESSION_COOKIE_DOMAIN
        ? { domain: process.env.SESSION_COOKIE_DOMAIN }
        : {}),
      path: '/',
    };
    res.clearCookie(cookieName, options);
  }
}
