import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPrismaRepository } from '@infra/persistence/repositories/user.prisma.repository';

@Injectable()
export class AuthService {
  constructor(
    private users: UserPrismaRepository,
    private jwt: JwtService,
  ) {}

  async validateGoogleUser(googleUser: {
    provider: 'google';
    providerAccountId: string;
    email?: string;
    name?: string;
    image?: string;
    accessToken?: string;
    refreshToken?: string;
  }) {
    let user = await this.users.findByProviderId(
      'google',
      googleUser.providerAccountId,
    );
    console.log('Google Callback User:', user);

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

  login(user: { id: string; email?: string | null }) {
    const payload = { sub: user.id, email: user.email ?? undefined };

    return { access_token: this.jwt.sign(payload) };
  }
}
