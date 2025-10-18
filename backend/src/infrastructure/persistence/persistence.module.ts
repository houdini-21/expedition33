import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { BookingPrismaRepository } from '../persistence/repositories/booking.prisma.repository';
import { UserPrismaRepository } from '../persistence/repositories/user.prisma.repository';
import { BOOKING_REPOSITORY } from '@domain/repository/booking.repository';
import { ACCOUNT_REPOSITORY } from '@domain/repository/account.repository';

@Module({
  providers: [
    PrismaService,
    BookingPrismaRepository,
    UserPrismaRepository,
    { provide: BOOKING_REPOSITORY, useExisting: BookingPrismaRepository },
    { provide: ACCOUNT_REPOSITORY, useExisting: UserPrismaRepository },
  ],
  exports: [
    PrismaService,
    BookingPrismaRepository,
    UserPrismaRepository,
    { provide: BOOKING_REPOSITORY, useExisting: BookingPrismaRepository },
    { provide: ACCOUNT_REPOSITORY, useExisting: UserPrismaRepository },
  ],
})
export class PersistenceModule {}
