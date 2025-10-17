import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
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
  @ApiOperation({ summary: 'Google OAuth Callback' })
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
    @Query('returnUrl') returnUrl?: string, // opcional
  ) {
    const user = await this.auth.validateGoogleUser(req.user);
    if (!user) throw new UnauthorizedException('No user from google');

    const token = this.auth.login({ id: user.id, email: user.email });

    const cookieName = process.env.SESSION_COOKIE_NAME || 'session';
    const domain = process.env.SESSION_COOKIE_DOMAIN || '.houdini-21.tech';
    const maxAge = Number(
      process.env.SESSION_COOKIE_MAX_AGE_MS || 1000 * 60 * 60 * 24,
    );

    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain,
      path: '/',
      maxAge,
    });

    const baseFront =
      process.env.FRONTEND_PUBLIC_URL || 'https://app.houdini-21.tech';
    const safeReturn =
      returnUrl && returnUrl.startsWith(baseFront)
        ? returnUrl
        : `${baseFront}/dashboard`;

    res.redirect(safeReturn);
  }
}
