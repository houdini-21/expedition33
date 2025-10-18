import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { HealthModule } from './presentation/health/health.module';
import { BookingModule } from '@presentation/booking/booking.module';
import { AuthPresentationModule } from '@presentation/auth/auth.module';
import { GoogleCalendarPresentationModule } from '@presentation/google-calendar/google-calendar.module';

@Module({
  imports: [
    AppConfigModule,
    HealthModule,
    BookingModule,
    AuthPresentationModule,
    GoogleCalendarPresentationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
