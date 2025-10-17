import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { CreateBookingCommand } from '../dto/commands/create-booking.command';
import { BOOKING_REPOSITORY } from '@domain/repository/booking.repository';
import type { IBookingRepository } from '@domain/repository/booking.repository';

@Injectable()
export class CreateBookingUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY) private readonly repo: IBookingRepository,
  ) {}

  async execute(cmd: CreateBookingCommand): Promise<{ id: string }> {
    const { userId, title, startsAt, endsAt } = cmd.input;
    if (startsAt >= endsAt) throw new BadRequestException('InvalidTimeRange');

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
