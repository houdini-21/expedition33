import { Account } from '@domain/entities/account.entity';

export interface IAccountRepository {
  /**
   * Link an OAuth account to a user
   */
  linkAccount(
    userId: string,
    provider: string,
    account: {
      providerAccountId: string;
      accessToken?: string;
      refreshToken?: string;
      expiresAt?: Date;
    },
  ): Promise<Account>;

  /**
   * Create a new user from a Google profile
   */
  createFromGoogleProfile(profile: {
    email?: string;
    name?: string;
    image?: string;
    providerAccountId: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
  }): Promise<any>;

  updateGoogleTokens(params: {
    userId: string;
    providerAccountId: string;
    accessToken?: string | null;
    refreshToken?: string | null;
    expiresAt?: Date | null;
  }): Promise<void>;

  /**
   * Check if a user has connected their Google account
   */
  isGoogleConnected(userId: string): Promise<boolean>;

  getGoogleTokens(userId: string): Promise<{
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: Date | null;
  } | null>;
}

export const ACCOUNT_REPOSITORY = 'AccountRepository';
