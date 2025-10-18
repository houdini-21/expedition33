import type { Response } from 'express';

export const AUTH_PORT = Symbol('AUTH_PORT');

export type GoogleAuthProfile = {
  provider: 'google';
  providerAccountId: string;
  email?: string;
  name?: string;
  image?: string;
  accessToken?: string;
  refreshToken?: string;
};

export type MinimalUser = {
  id: string;
  email: string | null;
  name?: string | null;
  image?: string | null;
  providerAccountId?: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
};

export interface IAuthPort {
  validateGoogleUser(
    googleUser: GoogleAuthProfile,
  ): Promise<MinimalUser | null>;

  login(user: {
    id: string;
    email?: string;
  }): Promise<string | { access_token: string }>;
  me(userId: string): Promise<unknown>;

  setSessionCookie(res: Response, token: string): void;
  readonly postLoginRedirect: string;
}
