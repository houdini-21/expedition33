import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  UseGuards,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GOOGLE_CALENDAR_PORT } from '@app/ports/google-calendar.port';
import type { IGoogleCalendarPort } from '@app/ports/google-calendar.port';
import { ok } from '@common/http/response.types';
import type { Request, Response } from 'express';
import { ApiOperation } from '@nestjs/swagger';

type AuthedRequest = Request & { user: { userId: string } };

@Controller('integrations/google')
export class GoogleCalendarController {
  constructor(
    @Inject(GOOGLE_CALENDAR_PORT)
    private readonly google: IGoogleCalendarPort,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check for Google Calendar integration' })
  ok() {
    return ok({ status: 'Google Calendar integration service is running' });
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('oauth-url')
  @ApiOperation({ summary: 'Get Google OAuth URL' })
  oauthUrl(@Req() req: AuthedRequest) {
    const userId = req.user.userId;
    if (!userId) throw new BadRequestException('Usuario no autenticado');
    const url = this.google.getAuthUrl(userId);
    return ok({ url });
  }

  @Get('callback')
  @ApiOperation({ summary: 'Google OAuth Callback' })
  async callback(
    @Query('code') code: string,
    @Query('state') stateUserId: string,
    @Res() res: Response,
  ) {
    await this.google.handleCallback(code, stateUserId);

    return res.redirect(String(this.google.postConnectRedirect));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get Google Calendar connection status' })
  @Get('status')
  async status(@Req() req: AuthedRequest) {
    const userId = req.user.userId;
    const connected = await this.google.isConnected(userId);
    return ok({ connected });
  }
}
