import { Booking } from '@domain/entities/booking.entity';

export interface IBookingRepository {
  /**
   * Return true if there is an overlap with [startsAt, endsAt)
   */
  findOverlaps(
    startsAt: Date,
    endsAt: Date,
    opts?: { excludeId?: string },
  ): Promise<boolean>;

  /**
   * Find all bookings that overlap with [startsAt, endsAt)
   */
  findAllOverlapping(startsAt: Date, endsAt: Date): Promise<Booking[]>;

  /**
   * Create a booking
   */
  create(
    data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Booking>;

  /**
   * List bookings by user
   */
  listByUser(
    userId: string,
    startAt?: Date,
    endAt?: Date,
    statusId?: number,
  ): Promise<Booking[]>;

  /**
   * Get one by id
   */
  getById(id: string): Promise<Booking | null>;

  /**
   * Update (e.g. reschedule / change status)
   */
  update(
    id: string,
    changes: Partial<
      Pick<Booking, 'title' | 'startsAt' | 'endsAt' | 'statusId'>
    >,
  ): Promise<Booking>;
}

export const BOOKING_REPOSITORY = Symbol('BOOKING_REPOSITORY');
