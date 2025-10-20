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

  /**
   * This TypeScript function executes a command to create a booking, checking for valid time range,
   * past dates, user availability in Google Calendar, and existing overlaps before creating the
   * booking.
   * @param {CreateBookingCommand} cmd - The `cmd` parameter in the `execute` function is of type
   * `CreateBookingCommand`, which contains the following properties:
   * @returns The `execute` function returns a Promise that resolves to an object containing the `id` of
   * the created booking. The structure of the returned object is `{ id: string }`.
   */
  async execute(cmd: CreateBookingCommand): Promise<{ id: string }> {
    const { userId, title, startsAt, endsAt } = cmd.input;
    if (startsAt >= endsAt) throw new BadRequestException('InvalidTimeRange');

    if (startsAt < new Date() || endsAt < new Date())
      throw new BadRequestException('Cannot create booking in the past');

    const isBusy = await this.googleCalendar.hasBusy(userId, startsAt, endsAt);
    if (isBusy)
      throw new BadRequestException('Time slot busy in Google Calendar');

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
