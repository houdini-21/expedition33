import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { google, Auth } from 'googleapis';
import { ACCOUNT_REPOSITORY } from '@domain/repository/account.repository';
import type { IAccountRepository } from '@domain/repository/account.repository';

@Injectable()
export class GoogleCalendarService {
  private readonly oauth: Auth.OAuth2Client;

  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accounts: IAccountRepository,
  ) {
    const cid = process.env.GOOGLE_CLIENT_ID || '';
    const sec = process.env.GOOGLE_CLIENT_SECRET || '';
    const cb = process.env.GOOGLE_CALENDAR_CALLBACK_URL || '';
    if (!cid || !sec || !cb) {
      throw new Error(
        'Faltan GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_CALENDAR_CALLBACK_URL en process.env',
      );
    }
    this.oauth = new google.auth.OAuth2(cid, sec, cb);
  }

  getAuthUrl(userId: string): string {
    if (!userId) throw new BadRequestException('userId requerido');
    return this.oauth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/calendar.readonly',
        'openid',
        'email',
        'profile',
      ],
      state: userId,
    });
  }

  async handleCallback(code: string, stateUserId: string): Promise<void> {
    if (!code || !stateUserId) {
      throw new BadRequestException('code/state faltantes en callback');
    }

    const { tokens } = await this.oauth.getToken(code);

    await this.accounts.updateGoogleTokens({
      userId: stateUserId,
      providerAccountId: stateUserId,
      accessToken: tokens.access_token ?? null,
      refreshToken: tokens.refresh_token ?? undefined,
      expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
    });
  }

  get postConnectRedirect(): string {
    return process.env.APP_POST_CONNECT_REDIRECT || '/';
  }

  async isConnected(userId: string): Promise<boolean> {
    return this.accounts.isGoogleConnected(userId);
  }
}
