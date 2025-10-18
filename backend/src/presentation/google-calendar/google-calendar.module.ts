import { Module } from '@nestjs/common';
import { GoogleCalendarController } from './google-calendar.controller';
import { GoogleCalendarModule } from '@infra/google-calendar/google-calendar.module';

@Module({
  imports: [GoogleCalendarModule],
  controllers: [GoogleCalendarController],
})
export class GoogleCalendarPresentationModule {}
