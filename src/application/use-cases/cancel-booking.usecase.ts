import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { BOOKING_REPOSITORY } from '@domain/repository/booking.repository';
import type { IBookingRepository } from '@domain/repository/booking.repository';

@Injectable()
export class CancelBookingUseCase {
  constructor(@Inject(BOOKING_REPOSITORY) private repo: IBookingRepository) {}

  async cancel(id: string, userId: string) {
    const booking = await this.repo.getById(id);

    if (!booking) throw new BadRequestException('Booking not found');

    if (booking.userId !== userId)
      throw new BadRequestException('You can only cancel your own bookings');

    if (booking.statusId === 2)
      throw new BadRequestException('Booking is already cancelled');

    return this.repo.update(id, { statusId: 2 });
  }
}
