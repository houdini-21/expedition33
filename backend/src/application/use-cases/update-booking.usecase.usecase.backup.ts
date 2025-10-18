import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { BOOKING_REPOSITORY } from '@domain/repository/booking.repository';
import type { IBookingRepository } from '@domain/repository/booking.repository';

@Injectable()
export class UpdateBookingUseCase {
  constructor(@Inject(BOOKING_REPOSITORY) private repo: IBookingRepository) {}

  async update(
    id: string,
    input: {
      title: string;
      startAt: string;
      endAt: string;
      userId: string;
    },
  ) {
    const start = new Date(input.startAt);
    const end = new Date(input.endAt);
    if (start >= end)
      throw new BadRequestException('startAt must be before endAt');

    const overlaps = await this.repo.findOverlaps(input.userId, start, end, {
      excludeId: id,
    });
    if (overlaps) throw new BadRequestException('Time slot already taken');

    const existing = await this.repo.getById(id);
    if (!existing) throw new BadRequestException('Booking not found');

    if (existing.userId !== input.userId)
      throw new BadRequestException('You can only update your own bookings');

    if (existing.statusId === 2)
      throw new BadRequestException('You cannot update a cancelled booking');

    return this.repo.update(id, {
      title: input.title,
      startsAt: start,
      endsAt: end,
    });
  }
}
