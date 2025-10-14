import { created } from '@common/http/response.types';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/persistence/prisma/prisma.service';
import { Account } from '@domain/entities/account.entity';
import { IAccountRepository } from '@domain/repository/account.repository';

@Injectable()
export class UserPrismaRepository implements IAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByProviderId(provider: string, providerAccountId: string) {
    return this.prisma.user.findFirst({
      where: { accounts: { some: { provider, providerAccountId } } },
    });
  }

  async linkAccount(
    userId: string,
    provider: string,
    account: {
      providerAccountId: string;
      accessToken?: string;
      refreshToken?: string;
      expiresAt?: Date;
    },
  ): Promise<Account> {
    const user = await this.prisma.account.create({
      data: {
        userId,
        provider,
        providerAccountId: account.providerAccountId,
        accessToken: account.accessToken,
        refreshToken: account.refreshToken,
        expiresAt: account.expiresAt,
      },
    });

    return new Account(
      user.id,
      'google',
      user.providerAccountId,
      user.expiresAt,
    );
  }

  async createFromGoogleProfile(profile: {
    email?: string;
    name?: string;
    image?: string;
    providerAccountId: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
  }): Promise<any> {
    const createdUser = await this.prisma.user.create({
      data: {
        email: profile.email,
        name: profile.name,
        image: profile.image,
        accounts: {
          create: {
            provider: 'google',
            providerAccountId: profile.providerAccountId,
            accessToken: profile.accessToken,
            refreshToken: profile.refreshToken,
            expiresAt: profile.expiresAt,
          },
        },
      },
      include: { accounts: true },
    });

    return created(createdUser);
  }
}
