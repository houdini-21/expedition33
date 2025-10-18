import { Inject, Injectable } from '@nestjs/common';
import { BOOKING_REPOSITORY } from '@domain/repository/booking.repository';
import type { IBookingRepository } from '@domain/repository/booking.repository';

@Injectable()
export class GetBookingsByUserUseCase {
  constructor(@Inject(BOOKING_REPOSITORY) private repo: IBookingRepository) {}

  async listByUser(
    userId: string,
    startsAt: string,
    endsAt: string,
    statusId?: number,
  ) {
    return this.repo.listByUser(
      userId,
      new Date(startsAt),
      new Date(endsAt),
      statusId,
    );
  }
}
