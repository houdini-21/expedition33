import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { CreateBookingCommand } from '../dto/commands/create-booking.command';
import { BOOKING_REPOSITORY } from '@domain/repository/booking.repository';
import type { IBookingRepository } from '@domain/repository/booking.repository';
import { GOOGLE_CALENDAR_PORT } from '@app/ports/google-calendar.port';
import type { IGoogleCalendarPort } from '@app/ports/google-calendar.port';

@Injectable()
export class CreateBookingUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY) private readonly repo: IBookingRepository,
    @Inject(GOOGLE_CALENDAR_PORT)
    private readonly googleCalendar: IGoogleCalendarPort,
  ) {}

  async execute(cmd: CreateBookingCommand): Promise<{ id: string }> {
    const { userId, title, startsAt, endsAt } = cmd.input;
    if (startsAt >= endsAt) throw new BadRequestException('InvalidTimeRange');

    if (startsAt < new Date() || endsAt < new Date())
      throw new BadRequestException('Cannot create booking in the past');

    const isBusy = await this.googleCalendar.hasBusy(userId, startsAt, endsAt);
    if (isBusy)
      throw new BadRequestException('User is busy in Google Calendar');

    const overlap = await this.repo.findOverlaps(userId, startsAt, endsAt);
    if (overlap) throw new BadRequestException('Time slot already taken');

    const created = await this.repo.create({
      title,
      startsAt,
      endsAt,
      userId,
      statusId: 1,
    });
    return { id: created.id };
  }
}
