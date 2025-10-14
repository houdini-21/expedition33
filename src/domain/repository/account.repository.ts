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
}

export const ACCOUNT_REPOSITORY = 'AccountRepository';
