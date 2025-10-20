import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CancelBookingCommand } from '../dto/commands/cancel-booking.command';
import { BOOKING_REPOSITORY } from '@domain/repository/booking.repository';
import type { IBookingRepository } from '@domain/repository/booking.repository';

@Injectable()
export class CancelBookingUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY) private readonly repo: IBookingRepository,
  ) {}

  /**
   * The function executes a command to cancel a booking after performing necessary checks.
   * @param {CancelBookingCommand} cmd - CancelBookingCommand
   */
  async execute(cmd: CancelBookingCommand): Promise<void> {
    const {
      id,
      input: { userId },
    } = cmd;
    const booking = await this.repo.getById(id);
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId) throw new ForbiddenException('Not allowed');
    if (booking.statusId === 2)
      throw new BadRequestException('Already cancelled');

    await this.repo.update(id, { statusId: 2 });
  }
}
