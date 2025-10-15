import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { BOOKING_REPOSITORY } from '@domain/repository/booking.repository';
import type { IBookingRepository } from '@domain/repository/booking.repository';

@Injectable()
export class GetBookingsUseCase {
  constructor(@Inject(BOOKING_REPOSITORY) private repo: IBookingRepository) {}

  async listAllOverlappingBookings(startsAt: Date, endsAt: Date) {
    if (startsAt >= endsAt) {
      throw new BadRequestException('startsAt must be before endsAt');
    }
    return this.repo.findAllOverlapping(startsAt, endsAt);
  }
}
