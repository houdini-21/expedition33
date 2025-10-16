import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { PrismaService } from '@infra/persistence/prisma/prisma.service';
import { BookingPrismaRepository } from '@infra/persistence/repositories/booking.prisma.repository';
import { BOOKING_REPOSITORY } from '@domain/repository/booking.repository';
import { CreateBookingUseCase } from '@app/use-cases/create-booking.usecase';
import { CancelBookingUseCase } from '@app/use-cases/cancel-booking.usecase';
import { UpdateBookingUseCase } from '@app/use-cases/update-booking.usecase';
import { GetBookingsUseCase } from '@app/use-cases/get-bookings.usecase';
import { GetBookingsByUserUseCase } from '@app/use-cases/get-booking-by-user.usecase';
import { GoogleCalendarModule } from '@infra/google-calendar/google-calendar.module';

@Module({
  imports: [GoogleCalendarModule],
  controllers: [BookingController],
  providers: [
    PrismaService,
    { provide: BOOKING_REPOSITORY, useClass: BookingPrismaRepository },
    CreateBookingUseCase,
    CancelBookingUseCase,
    UpdateBookingUseCase,
    GetBookingsUseCase,
    GetBookingsByUserUseCase,
  ],
})
export class BookingModule {}
