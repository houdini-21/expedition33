// @infra/persistence/repositories/user.prisma.repository.ts
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

    return createdUser;
  }

  async updateGoogleTokens(params: {
    userId: string;
    providerAccountId: string;
    accessToken?: string | null;
    refreshToken?: string | null;
    expiresAt?: Date | null;
  }): Promise<void> {
    const {
      userId,
      providerAccountId,
      accessToken = null,
      refreshToken,
      expiresAt = null,
    } = params;

    const existing = await this.prisma.account.findFirst({
      where: { userId, provider: 'google' },
      select: { id: true, refreshToken: true },
    });

    if (!existing) {
      await this.prisma.account.create({
        data: {
          userId,
          provider: 'google',
          providerAccountId,
          accessToken,
          refreshToken: refreshToken ?? null,
          expiresAt,
        },
      });
      return;
    }

    await this.prisma.account.update({
      where: { id: existing.id },
      data: {
        providerAccountId,
        accessToken,
        refreshToken: refreshToken ?? existing.refreshToken,
        expiresAt,
      },
    });
  }

  async isGoogleConnected(userId: string): Promise<boolean> {
    const acc = await this.prisma.account.findFirst({
      where: {
        userId,
        provider: 'google',
        refreshToken: { not: null },
      },
      select: { id: true },
    });
    return !!acc;
  }
}
