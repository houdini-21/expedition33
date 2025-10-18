import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AUTH_PORT } from '@app/ports/auth.port';
import type { IAuthPort } from '@app/ports/auth.port';

type Input = { userId: string };
type Output = { user: unknown };

@Injectable()
export class GetMeUseCase {
  constructor(@Inject(AUTH_PORT) private readonly auth: IAuthPort) {}

  async execute({ userId }: Input): Promise<Output> {
    const user = await this.auth.me(userId);
    if (!user) throw new UnauthorizedException('No user found');
    return { user };
  }
}
