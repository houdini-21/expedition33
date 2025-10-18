import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '@infra/auth/auth.service';
import { ok } from '@common/http/response.types';
import { UnauthorizedException } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Get('google')
  @ApiOperation({ summary: 'Get Google OAuth URL' })
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    return ok({ redirect: 'Google OAuth' });
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.auth.validateGoogleUser(req.user);
    if (!user) throw new UnauthorizedException('No user from google');

    const lr = this.auth.login({ id: user.id, email: user.email });
    const token = typeof lr === 'string' ? lr : lr?.access_token;
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

    const baseFront =
      process.env.FRONTEND_PUBLIC_URL || 'http://localhost:3000';
    res.redirect(`${baseFront}/bookings`);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async me(@Req() req: any) {
    const user = await this.auth.me(req.user.userId);
    if (!user) throw new UnauthorizedException('No user found');

    return ok({ user });
  }
}
