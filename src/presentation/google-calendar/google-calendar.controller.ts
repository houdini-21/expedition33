import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleCalendarService } from '@infra/google-calendar/google-calendar.service';
import { ok } from '@common/http/response.types';
import type { Response } from 'express';

type AuthedRequest = Request & { user: { userId: string } };

@Controller('integrations/google')
export class GoogleCalendarController {
  constructor(private readonly google: GoogleCalendarService) {}

  @Get()
  ok() {
    return ok({ status: 'Google Calendar integration service is running' });
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('oauth-url')
  oauthUrl(@Req() req: AuthedRequest) {
    const userId = req.user.userId;
    if (!userId) throw new BadRequestException('Usuario no autenticado');
    const url = this.google.getAuthUrl(userId);
    return ok({ url });
  }

  @Get('callback')
  async callback(
    @Query('code') code: string,
    @Query('state') stateUserId: string,
    @Res() res: Response,
  ) {
    await this.google.handleCallback(code, stateUserId);
    return res.redirect(this.google.postConnectRedirect);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('status')
  async status(@Req() req: AuthedRequest) {
    const userId = req.user.userId;
    const connected = await this.google.isConnected(userId);
    return ok({ connected });
  }
}
