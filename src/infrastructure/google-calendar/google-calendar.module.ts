import { Module } from '@nestjs/common';
import { GoogleCalendarService } from './google-calendar.service';
import { ACCOUNT_REPOSITORY } from '@domain/repository/account.repository';
import { UserPrismaRepository } from '@infra/persistence/repositories/user.prisma.repository';
import { PrismaService } from '@infra/persistence/prisma/prisma.service';

@Module({
  providers: [
    PrismaService,
    GoogleCalendarService,
    { provide: ACCOUNT_REPOSITORY, useExisting: UserPrismaRepository },
    UserPrismaRepository,
  ],
  exports: [GoogleCalendarService],
})
export class GoogleCalendarInfraModule {}
