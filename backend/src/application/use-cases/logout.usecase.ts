import { Inject, Injectable } from '@nestjs/common';
import { AUTH_PORT } from '@app/ports/auth.port';
import type { IAuthPort } from '@app/ports/auth.port';
import type { Response } from 'express';

@Injectable()
export class LogoutUseCase {
  constructor(@Inject(AUTH_PORT) private readonly auth: IAuthPort) {}

  execute({ res }: { res: Response }) {
    this.auth.logout(res);
    return { message: 'Logout successful' };
  }
}
