import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './auth.service';
import { PrismaService } from '@infra/persistence/prisma/prisma.service';
import { UserPrismaRepository } from '@infra/persistence/repositories/user.prisma.repository';
import { AUTH_PORT } from '@app/ports/auth.port';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN
          ? Number(process.env.JWT_EXPIRES_IN)
          : 486400,
      },
    }),
  ],
  providers: [
    PrismaService,
    UserPrismaRepository,
    AuthService,
    GoogleStrategy,
    JwtStrategy,
    { provide: AUTH_PORT, useExisting: AuthService },
  ],
  exports: [AUTH_PORT],
})
export class AuthModule {}
