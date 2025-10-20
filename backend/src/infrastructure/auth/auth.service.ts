import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserPrismaRepository } from '@infra/persistence/repositories/user.prisma.repository';
import type {
  GoogleAuthProfile,
  IAuthPort,
  MinimalUser,
} from '@app/ports/auth.port';

@Injectable()
export class AuthService implements IAuthPort {
  constructor(
    private users: UserPrismaRepository,
    private jwt: JwtService,
  ) {}

  /**
   * The function `validateGoogleUser` checks if a user exists in the database based on their Google
   * provider ID and creates a new user if not found.
   * @param {GoogleAuthProfile} googleUser - The `validateGoogleUser` function takes a `googleUser`
   * object of type `GoogleAuthProfile` as a parameter. This object typically contains information about
   * a user authenticated through Google, such as their email, name, image, provider account ID, access
   * token, and refresh token.
   * @returns The `validateGoogleUser` function returns a `Promise` that resolves to either a
   * `MinimalUser` object or `null`.
   */
  async validateGoogleUser(
    googleUser: GoogleAuthProfile,
  ): Promise<MinimalUser | null> {
    let user = await this.users.findByProviderId(
      'google',
      googleUser.providerAccountId,
    );

    if (!user) {
      user = await this.users.createFromGoogleProfile({
        email: googleUser.email,
        name: googleUser.name,
        image: googleUser.image,
        providerAccountId: googleUser.providerAccountId,
        accessToken: googleUser.accessToken,
        refreshToken: googleUser.refreshToken,
      });
    }

    return user;
  }

  /**
   * The login function in TypeScript asynchronously generates an access token for a user based on their
   * ID and email.
   * @param user - The `login` function takes a user object as a parameter, which has the following
   * properties:
   * @returns The `login` function returns a Promise that resolves to an object containing an
   * `access_token` property, which is a string.
   */
  async login(user: {
    id: string;
    email?: string;
  }): Promise<{ access_token: string }> {
    const payload = { sub: user.id, email: user.email ?? undefined };
    const access_token = await this.jwt.signAsync(payload);
    return { access_token };
  }

  /**
   * The `me` function retrieves a user by their ID.
   * @param {string} userId - The `userId` parameter is a string that represents the unique identifier of
   * a user. It is used to look up and retrieve the user information from a data source, such as a
   * database, based on this identifier.
   * @returns the user with the specified `userId` by calling the `findById` method on the `users`
   * object.
   */
  me(userId: string) {
    return this.users.findById(userId);
  }
  /**
   * The function `postLoginRedirect` returns the URL for redirecting users after logging in.
   * @returns The `postLoginRedirect` method is returning the URL for redirecting after a successful
   * login. The URL is constructed using the `baseFront` variable, which is set to the value of the
   * `FRONTEND_PUBLIC_URL` environment variable if it exists, or defaults to `http://localhost:3000`. The
   * final URL being returned is `/bookings`.
   */

  get postLoginRedirect(): string {
    const baseFront =
      process.env.FRONTEND_PUBLIC_URL || 'http://localhost:3000';
    return `${baseFront}/bookings`;
  }

  /**
   * The function `setSessionCookie` sets a session cookie with specified options including token, cookie
   * name, max age, secure flag, and domain.
   * @param {Response} res - The `res` parameter in the `setSessionCookie` function is typically the
   * response object that is passed in from an HTTP request handler. It is used to set the session cookie
   * in the response headers so that it can be stored on the client side.
   * @param {string} token - The `token` parameter in the `setSessionCookie` function is a string that
   * represents the session token generated for the user. This token is typically used for authentication
   * and authorization purposes to identify and validate the user's session.
   */
  setSessionCookie(res: Response, token: string): void {
    if (!token) throw new UnauthorizedException('Token generation failed');

    const isProd = process.env.NODE_ENV === 'production';
    const cookieName = process.env.SESSION_COOKIE_NAME || 'jwt';
    const maxAge = Number(process.env.SESSION_COOKIE_MAX_AGE_MS || 86400000);

    res.cookie(cookieName, token, {
      httpOnly: true,
      path: '/',
      maxAge,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      ...(isProd && process.env.SESSION_COOKIE_DOMAIN
        ? { domain: process.env.SESSION_COOKIE_DOMAIN }
        : {}),
    });
  }

  /**
   * The `logout` function clears a cookie named 'jwt' from the response object with specific options
   * based on the environment settings.
   * @param {Response} res - The `res` parameter in the `logout` function is typically a response object
   * that represents the HTTP response that will be sent back to the client. It is commonly used in web
   * development to send data, cookies, and status codes back to the client's browser.
   */
  logout(res: Response): void {
    const cookieName = process.env.SESSION_COOKIE_NAME || 'jwt';
    const isProd = process.env.NODE_ENV === 'production';
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      ...(isProd && process.env.SESSION_COOKIE_DOMAIN
        ? { domain: process.env.SESSION_COOKIE_DOMAIN }
        : {}),
      path: '/',
    };
    res.clearCookie(cookieName, options);
  }
}
