import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { BOOKING_REPOSITORY } from '@domain/repository/booking.repository';
import type { IBookingRepository } from '@domain/repository/booking.repository';
import { GOOGLE_CALENDAR_PORT } from '@app/ports/google-calendar.port';
import type { IGoogleCalendarPort } from '@app/ports/google-calendar.port';

@Injectable()
export class CreateBookingUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY) private readonly repo: IBookingRepository,
    @Inject(GOOGLE_CALENDAR_PORT) private readonly gcal: IGoogleCalendarPort,
  ) {}

  async create(input: {
    title: string;
    startAt: string;
    endAt: string;
    userId: string;
  }) {
    const start = new Date(input.startAt);
    const end = new Date(input.endAt);

    if (isNaN(start.valueOf()) || isNaN(end.valueOf()))
      throw new BadRequestException('Invalid dates');
    if (start >= end)
      throw new BadRequestException('startAt must be before endAt');

    const overlaps = await this.repo.findOverlaps(start, end);
    if (overlaps) throw new BadRequestException('Time slot already taken');

    const busy = await this.gcal.hasBusy(input.userId, start, end);
    if (busy)
      throw new BadRequestException('Conflicts with Google Calendar event');

    return this.repo.create({
      title: input.title,
      startsAt: start,
      endsAt: end,
      userId: input.userId,
      statusId: 1,
    });
  }
}
