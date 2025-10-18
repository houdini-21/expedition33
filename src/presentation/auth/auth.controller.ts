import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ok } from '@common/http/response.types';
import { UnauthorizedException } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';
import { LoginWithGoogleCallbackUseCase } from '@app/use-cases/login-with-google-callback.usecase';
import { GetMeUseCase } from '@app/use-cases/get-me.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginWithGoogleCallback: LoginWithGoogleCallbackUseCase,
    private readonly getMeUc: GetMeUseCase,
  ) {}

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
    const { redirectTo } = await this.loginWithGoogleCallback.execute({
      googleProfile: req.user,
      res,
    });
    res.redirect(redirectTo);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async me(@Req() req: any) {
    const { user } = await this.getMeUc.execute({ userId: req.user.userId });
    if (!user) throw new UnauthorizedException('No user found');
    return ok({ user });
  }
}
