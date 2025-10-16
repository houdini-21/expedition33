import {
  Inject,
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { google, Auth } from 'googleapis';
import { ACCOUNT_REPOSITORY } from '@domain/repository/account.repository';
import type { IAccountRepository } from '@domain/repository/account.repository';
import { IGoogleCalendarPort } from '@app/ports/google-calendar.port';

@Injectable()
export class GoogleCalendarService implements IGoogleCalendarPort {
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
    if (!code || !stateUserId)
      throw new BadRequestException('code/state faltantes en callback');
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

  // ---------- NUEVO: util para setear credenciales del usuario ----------
  private async authFor(userId: string): Promise<Auth.OAuth2Client> {
    const creds = await this.accounts.getGoogleTokens(userId); // <-- agrega este método en tu repo si no existe
    if (!creds?.refreshToken) {
      // estrictos para el test (si no está conectado, bloquea creación)
      throw new UnauthorizedException('Google Calendar not connected');
      // si quieres permitir creación sin calendar, devuelve this.oauth sin creds y hasBusy() -> false
    }

    this.oauth.setCredentials({
      access_token: creds.accessToken ?? undefined,
      refresh_token: creds.refreshToken ?? undefined,
      expiry_date: creds.expiresAt
        ? new Date(creds.expiresAt).getTime()
        : undefined,
    });
    return this.oauth;
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
