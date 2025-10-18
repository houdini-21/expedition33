import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AUTH_PORT } from '@app/ports/auth.port';
import type { IAuthPort, GoogleAuthProfile } from '@app/ports/auth.port';
import type { Response } from 'express';

type Input = { googleProfile: GoogleAuthProfile; res: Response };
type Output = { redirectTo: string };

@Injectable()
export class LoginWithGoogleCallbackUseCase {
  constructor(@Inject(AUTH_PORT) private readonly auth: IAuthPort) {}

  async execute({ googleProfile, res }: Input): Promise<Output> {
    const user = await this.auth.validateGoogleUser(googleProfile);
    if (!user) throw new UnauthorizedException('No user from google');

    const lr = await this.auth.login({
      id: user.id,
      email: user.email ?? undefined,
    });
    const token = typeof lr === 'string' ? lr : lr.access_token;
    if (!token) throw new UnauthorizedException('Token generation failed');

    this.auth.setSessionCookie(res, token);
    return { redirectTo: this.auth.postLoginRedirect };
  }
}
