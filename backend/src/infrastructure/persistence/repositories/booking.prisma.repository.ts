import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infra/persistence/prisma/prisma.service';
import { Booking } from '@domain/entities/booking.entity';
import { IBookingRepository } from '@domain/repository/booking.repository';

@Injectable()
export class BookingPrismaRepository implements IBookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * The function `findOverlaps` checks if there are any bookings overlapping a specified time range for
   * a given user, excluding a specific booking ID if provided.
   * @param {string} userId - The `userId` parameter is a string that represents the unique identifier of
   * a user for whom we are checking for overlaps in bookings.
   * @param {Date} startsAt - The `startsAt` parameter represents the starting date and time for a
   * booking. It is a `Date` type indicating when the booking is scheduled to start.
   * @param {Date} endsAt - The `endsAt` parameter represents the end date and time for a booking. It is
   * used to determine the time range within which the booking occurs.
   * @param [opts] - The `opts` parameter in the `findOverlaps` function is an optional object that can
   * contain the property `excludeId`. If `excludeId` is provided in the `opts` object, it will be used
   * to exclude a specific ID from the query results. This can be useful when you
   * @returns The `findOverlaps` function returns a Promise that resolves to a boolean value. The
   * function checks if there is any booking that overlaps with the specified time range (startsAt to
   * endsAt) for a given userId. If an overlap is found, it returns `true`, otherwise it returns `false`.
   */
  async findOverlaps(
    userId: string,
    startsAt: Date,
    endsAt: Date,
    opts?: { excludeId?: string },
  ): Promise<boolean> {
    const where = {
      userId,
      AND: [{ startsAt: { lt: endsAt } }, { endsAt: { gt: startsAt } }],
      ...(opts?.excludeId ? { id: { not: opts.excludeId } } : {}),
      statusId: 1,
    };

    const found = await this.prisma.booking.findFirst({
      where,
      select: { id: true },
    });

    return !!found;
  }

  /**
   * This TypeScript function asynchronously finds all bookings that overlap with a specified time range
   * and returns them as an array of Booking objects.
   * @param {Date} startsAt - The `startsAt` parameter represents the starting date and time for which
   * you want to find overlapping bookings. This function is designed to retrieve bookings that have a
   * start time greater than or equal to the provided `startsAt` value.
   * @param {Date} endsAt - The `endsAt` parameter represents the end date and time for a booking. It is
   * used to find bookings that overlap with a specified time range.
   * @returns The `findAllOverlapping` function returns an array of `Booking` objects that overlap with
   * the specified time range defined by the `startsAt` and `endsAt` parameters. The function queries the
   * database using Prisma to find bookings where the `startsAt` is greater than or equal to the
   * `startsAt` parameter and the `endsAt` is less than or equal to the `ends
   */
  async findAllOverlapping(startsAt: Date, endsAt: Date): Promise<Booking[]> {
    const rows = await this.prisma.booking.findMany({
      where: {
        AND: [{ startsAt: { gte: startsAt } }, { endsAt: { lte: endsAt } }],
      },
      orderBy: { startsAt: 'asc' },
    });

    return rows.map(
      (r) =>
        new Booking(
          r.id,
          r.title,
          r.startsAt,
          r.endsAt,
          r.userId,
          r.statusId,
          r.createdAt,
          r.updatedAt,
        ),
    );
  }

  /**
   * This TypeScript function creates a new booking record in a database using data provided, and returns
   * the created booking object.
   * @param data - The `create` method is used to create a new booking record in the database. The `data`
   * parameter contains the information needed to create the booking, such as the title, start and end
   * times, user ID, and status ID. The method then uses this data to create a new booking record
   * @returns The `create` method is returning a `Promise` that resolves to a `Booking` object. The
   * `Booking` object is created using the data returned from the database after creating a new booking
   * record. The `Booking` object includes properties such as `id`, `title`, `startsAt`, `endsAt`,
   * `userId`, `statusId`, `createdAt`, and `updatedAt`.
   */
  async create(
    data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Booking> {
    const row = await this.prisma.booking.create({
      data: {
        title: data.title,
        startsAt: data.startsAt,
        endsAt: data.endsAt,
        userId: data.userId,
        statusId: data.statusId,
      },
    });

    return new Booking(
      row.id,
      row.title,
      row.startsAt,
      row.endsAt,
      row.userId,
      row.statusId,
      row.createdAt,
      row.updatedAt,
    );
  }

  /**
   * The `listByUser` function retrieves bookings for a specific user within a specified time range and
   * optional status ID.
   * @param {string} userId - The `userId` parameter is a string that represents the unique identifier of
   * the user for whom you want to list bookings. This function retrieves bookings based on the specified
   * user ID within the given time range and optional status ID.
   * @param {Date} startsAt - The `startsAt` parameter in the `listByUser` function represents the
   * starting date and time for filtering bookings. Bookings with a `startsAt` value greater than or
   * equal to this date will be included in the result.
   * @param {Date} endsAt - The `endsAt` parameter in the `listByUser` function represents the end date
   * and time for filtering bookings. Bookings with end times before or equal to this `endsAt` value will
   * be included in the results.
   * @param {number} [statusId] - The `statusId` parameter in the `listByUser` method is an optional
   * parameter of type number. It is used to filter bookings based on a specific status identifier. If a
   * `statusId` is provided, the method will include it as a filter condition in the query to fetch
   * bookings.
   * @returns The `listByUser` function returns a Promise that resolves to an array of `Booking` objects.
   * Each `Booking` object contains properties such as id, title, startsAt, endsAt, userId, statusId,
   * createdAt, updatedAt, and user (which includes id, name, email, and image properties). The function
   * fetches bookings from the database based on the provided userId, startsAt
   */
  async listByUser(
    userId: string,
    startsAt: Date,
    endsAt: Date,
    statusId?: number,
  ): Promise<Booking[]> {
    const rows = await this.prisma.booking.findMany({
      where: {
        AND: [{ startsAt: { gte: startsAt } }, { endsAt: { lte: endsAt } }],
        userId,
        ...(statusId ? { statusId } : {}),
      },
      orderBy: { startsAt: 'asc' },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    return rows.map(
      (r) =>
        new Booking(
          r.id,
          r.title,
          r.startsAt,
          r.endsAt,
          r.userId,
          r.statusId,
          r.createdAt,
          r.updatedAt,
          r.user,
        ),
    );
  }

  async getById(id: string): Promise<Booking | null> {
    const r = await this.prisma.booking.findUnique({ where: { id } });
    if (!r) return null;
    return new Booking(
      r.id,
      r.title,
      r.startsAt,
      r.endsAt,
      r.userId,
      r.statusId,
      r.createdAt,
      r.updatedAt,
    );
  }

  async update(
    id: string,
    changes: Partial<
      Pick<Booking, 'title' | 'startsAt' | 'endsAt' | 'statusId'>
    >,
  ): Promise<Booking> {
    const r = await this.prisma.booking.update({
      where: { id },
      data: {
        ...(changes.title !== undefined ? { title: changes.title } : {}),
        ...(changes.startsAt !== undefined
          ? { startsAt: changes.startsAt }
          : {}),
        ...(changes.endsAt !== undefined ? { endsAt: changes.endsAt } : {}),
        ...(changes.statusId !== undefined
          ? { statusId: changes.statusId }
          : {}),
      },
    });

    if (!r) throw new NotFoundException('Booking not found');

    return new Booking(
      r.id,
      r.title,
      r.startsAt,
      r.endsAt,
      r.userId,
      r.statusId,
      r.createdAt,
      r.updatedAt,
    );
  }
}
