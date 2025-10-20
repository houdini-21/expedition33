import { Inject, Injectable } from '@nestjs/common';
import { GetBookingsQuery } from '../dto/queries/get-bookings.query';
import { BOOKING_REPOSITORY } from '@domain/repository/booking.repository';
import { BookingResult } from '../dto/results/booking.result';
import type { IBookingRepository } from '@domain/repository/booking.repository';

@Injectable()
export class GetBookingsUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly repo: IBookingRepository,
  ) {}

  /**
   * This function executes a query to retrieve bookings based on a user ID, date range, and status,
   * returning an array of BookingResult objects with specific properties.
   * @param {GetBookingsQuery} query - The `execute` function takes a `GetBookingsQuery` object as a
   * parameter. The `GetBookingsQuery` object likely contains information needed to retrieve bookings,
   * such as the `userId`, `from` date, and `to` date.
   * @returns The `execute` function is returning an array of `BookingResult` objects. Each
   * `BookingResult` object contains the following properties:
   * - `id` (string): The booking ID
   * - `title` (string): The title of the booking
   * - `startsAt` (Date): The start date and time of the booking
   * - `endsAt` (Date): The end date and
   */
  async execute(query: GetBookingsQuery): Promise<BookingResult[]> {
    const { userId } = query;

    const from = query.from ?? new Date(0);
    const to = query.to ?? new Date('9999-12-31T00:00:00Z');

    const rows = await this.repo.listByUser(userId, from, to);
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      startsAt: r.startsAt, // Date
      endsAt: r.endsAt, // Date
      userId: r.userId,
      status: r.statusId === 2 ? 'cancelled' : 'active',
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      user: {
        id: r.user?.id ?? null,
        name: r.user?.name ?? null,
        email: r.user?.email ?? null,
        image: r.user?.image ?? null,
      },
    }));
  }
}
