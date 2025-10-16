import { Module } from '@nestjs/common';
import { GoogleCalendarController } from './google-calendar.controller';
import { GoogleCalendarInfraModule } from '@infra/google-calendar/google-calendar.module';

@Module({
  imports: [GoogleCalendarInfraModule],
  controllers: [GoogleCalendarController],
})
export class GoogleCalendarPresentationModule {}
