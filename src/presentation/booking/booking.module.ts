import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { PrismaService } from '@infra/persistence/prisma/prisma.service';
import { BookingPrismaRepository } from '@infra/persistence/repositories/booking.prisma.repository';
import { BOOKING_REPOSITORY } from '@domain/repository/booking.repository';
import { CreateBookingUseCase } from '@app/use-cases/create-booking.usecase';

@Module({
  controllers: [BookingController],
  providers: [
    PrismaService,
    { provide: BOOKING_REPOSITORY, useClass: BookingPrismaRepository },
    CreateBookingUseCase,
    // GetUserBookingsUseCase, CancelBookingUseCase
  ],
})
export class BookingModule {}
