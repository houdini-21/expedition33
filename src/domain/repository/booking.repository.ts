import { Booking } from '../entities/booking.entity';

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
   * Create a booking
   */
  create(
    data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Booking>;

  /**
   * List bookings by user
   */
  listByUser(userId: string): Promise<Booking[]>;

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

  /**
   * Delete (soft or hard depending on your use case)
   */
  delete(id: string): Promise<void>;
}
