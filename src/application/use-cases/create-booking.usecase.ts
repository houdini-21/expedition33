import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { BOOKING_REPOSITORY } from '@domain/repository/booking.repository';
import type { IBookingRepository } from '@domain/repository/booking.repository';

@Injectable()
export class CreateBookingUseCase {
  constructor(@Inject(BOOKING_REPOSITORY) private repo: IBookingRepository) {}

  async execute(input: {
    title: string;
    startAt: string;
    endAt: string;
    userId: string;
  }) {
    const start = new Date(input.startAt);
    const end = new Date(input.endAt);
    if (start >= end)
      throw new BadRequestException('startAt must be before endAt');

    const overlaps = await this.repo.findOverlaps(start, end);
    if (!overlaps) throw new BadRequestException('Time slot already taken');

    return this.repo.create({
      title: input.title,
      startsAt: start,
      endsAt: end,
      userId: input.userId,
      statusId: 1,
    });
  }
}
