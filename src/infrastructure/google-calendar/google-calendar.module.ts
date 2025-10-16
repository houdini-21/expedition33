import { Module } from '@nestjs/common';
import { GoogleCalendarService } from './google-calendar.service';
import { PrismaService } from '@infra/persistence/prisma/prisma.service';
import { ACCOUNT_REPOSITORY } from '@domain/repository/account.repository';
import { UserPrismaRepository } from '@infra/persistence/repositories/user.prisma.repository';
import { GOOGLE_CALENDAR_PORT } from '@app/ports/google-calendar.port';

@Module({
  providers: [
    PrismaService,
    { provide: ACCOUNT_REPOSITORY, useClass: UserPrismaRepository },
    GoogleCalendarService,
    { provide: GOOGLE_CALENDAR_PORT, useExisting: GoogleCalendarService },
  ],
  exports: [
    GoogleCalendarService,
    { provide: GOOGLE_CALENDAR_PORT, useExisting: GoogleCalendarService },
  ],
})
export class GoogleCalendarModule {}
