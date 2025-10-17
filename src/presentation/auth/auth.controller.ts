import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '@infra/auth/auth.service';
import { ok } from '@common/http/response.types';
import { UnauthorizedException } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

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
  async googleCallback(@Req() req: any) {
    const user = await this.auth.validateGoogleUser(req.user);

    if (!user) {
      throw new UnauthorizedException('No user from google');
    }

    const token = this.auth.login({
      id: user.id,
      email: user.email,
    });

    return ok(token);
  }
}
