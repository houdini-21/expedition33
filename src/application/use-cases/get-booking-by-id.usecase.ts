import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { GetBookingByIdQuery } from '../dto/queries/get-booking-by-id.query';
import { BookingResult } from '../dto/results/booking.result';
import { BOOKING_REPOSITORY } from '@domain/repository/booking.repository';
import type { IBookingRepository } from '@domain/repository/booking.repository';

@Injectable()
export class GetBookingByIdUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY) private readonly repo: IBookingRepository,
  ) {}

  async execute(query: GetBookingByIdQuery): Promise<BookingResult> {
    const item = await this.repo.getById(query.id);
    if (!item) throw new NotFoundException('Booking not found');
    if (item.userId !== query.userId)
      throw new ForbiddenException('Not allowed');
    const status: 'active' | 'cancelled' =
      item.statusId === 2 ? 'cancelled' : 'active';

    return {
      id: item.id,
      title: item.title,
      startsAt: item.startsAt,
      endsAt: item.endsAt,
      userId: item.userId,
      status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      user: {
        id: item.user?.id ?? null,
        name: item.user?.name ?? null,
        email: item.user?.email ?? null,
        image: item.user?.image ?? null,
      },
    };
  }
}
