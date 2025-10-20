import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AUTH_PORT } from '@app/ports/auth.port';
import type { IAuthPort } from '@app/ports/auth.port';

type Input = { userId: string };
type Output = { user: unknown };

@Injectable()
export class GetMeUseCase {
  constructor(@Inject(AUTH_PORT) private readonly auth: IAuthPort) {}

  /**
   * This TypeScript function executes an asynchronous operation to retrieve user information based on
   * the provided user ID, handling unauthorized exceptions if the user is not found.
   * @param {Input}  - The `execute` function takes an `Input` object as a parameter, which has a
   * `userId` property. The function returns a `Promise` that resolves to an `Output` object. Inside the
   * function, it first calls the `me` method of the `auth` service with the `
   * @returns { user }
   */
  async execute({ userId }: Input): Promise<Output> {
    const user = await this.auth.me(userId);
    if (!user) throw new UnauthorizedException('No user found');
    return { user };
  }
}
