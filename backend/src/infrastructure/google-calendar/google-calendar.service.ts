import {
  Inject,
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';
import { ACCOUNT_REPOSITORY } from '@domain/repository/account.repository';
import type { IAccountRepository } from '@domain/repository/account.repository';
import { IGoogleCalendarPort } from '@app/ports/google-calendar.port';

@Injectable()
export class GoogleCalendarService implements IGoogleCalendarPort {
  private oauth?: Auth.OAuth2Client;

  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accounts: IAccountRepository,
    private readonly config: ConfigService,
  ) {}

  // Lazily initialize OAuth client using ConfigService so module instantiation
  // doesn't throw and tests can provide mocked ConfigService.
  private getOauthClient(): Auth.OAuth2Client {
    if (this.oauth) return this.oauth;

    const cid = this.config.get<string>('GOOGLE_CLIENT_ID') || '';
    const sec = this.config.get<string>('GOOGLE_CLIENT_SECRET') || '';
    const cb = this.config.get<string>('GOOGLE_CALENDAR_CALLBACK_URL') || '';
    if (!cid || !sec || !cb) {
      throw new Error(
        'Missing GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_CALENDAR_CALLBACK_URL in configuration',
      );
    }
    this.oauth = new google.auth.OAuth2(cid, sec, cb);
    return this.oauth;
  }

  getAuthUrl(userId: string): string {
    if (!userId) throw new BadRequestException('userId requerido');
    const oauth = this.getOauthClient();
    return oauth.generateAuthUrl({
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
    if (!code || !stateUserId)
      throw new BadRequestException('code/state faltantes en callback');
    const oauth = this.getOauthClient();
    const { tokens } = await oauth.getToken(code);

    await this.accounts.updateGoogleTokens({
      userId: stateUserId,
      providerAccountId: stateUserId,
      accessToken: tokens.access_token ?? null,
      refreshToken: tokens.refresh_token ?? undefined,
      expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
    });
  }

  get postConnectRedirect(): string {
    return this.config.get<string>('APP_POST_CONNECT_REDIRECT') || '/';
  }

  async isConnected(userId: string): Promise<boolean> {
    return this.accounts.isGoogleConnected(userId);
  }

  private async authFor(userId: string): Promise<Auth.OAuth2Client> {
    const oauth = this.getOauthClient();
    const creds = await this.accounts.getGoogleTokens(userId);
    if (!creds?.refreshToken) {
      throw new UnauthorizedException('Google Calendar not connected');
    }

    oauth.setCredentials({
      access_token: creds.accessToken ?? undefined,
      refresh_token: creds.refreshToken ?? undefined,
      expiry_date: creds.expiresAt
        ? new Date(creds.expiresAt).getTime()
        : undefined,
    });
    return oauth;
  }

  async hasBusy(userId: string, start: Date, end: Date): Promise<boolean> {
    const auth = await this.authFor(userId);
    const cal = google.calendar({ version: 'v3', auth });

    const res = await cal.freebusy.query({
      requestBody: {
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        items: [{ id: 'primary' }],
      },
    });

    const busy = res.data.calendars?.primary?.busy ?? [];
    return busy.length > 0;
  }
}
