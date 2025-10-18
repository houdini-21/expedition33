import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoogleCalendarService } from './google-calendar.service';
import { GOOGLE_CALENDAR_PORT } from '@app/ports/google-calendar.port';
import { PersistenceModule } from '@infra/persistence/persistence.module';

@Module({
  imports: [ConfigModule, PersistenceModule],
  providers: [
    GoogleCalendarService,
    { provide: GOOGLE_CALENDAR_PORT, useExisting: GoogleCalendarService },
  ],
  exports: [
    GoogleCalendarService,
    { provide: GOOGLE_CALENDAR_PORT, useExisting: GoogleCalendarService },
  ],
})
export class GoogleCalendarModule {}
