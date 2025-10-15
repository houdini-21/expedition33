import { Inject, Injectable } from '@nestjs/common';
import { BOOKING_REPOSITORY } from '@domain/repository/booking.repository';
import type { IBookingRepository } from '@domain/repository/booking.repository';

@Injectable()
export class GetBookingsByUserUseCase {
  constructor(@Inject(BOOKING_REPOSITORY) private repo: IBookingRepository) {}

  async listByUser(
    userId: string,
    startAt?: Date,
    endAt?: Date,
    statusId?: number,
  ) {
    return this.repo.listByUser(userId, startAt, endAt, statusId);
  }
}
