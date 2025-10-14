import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infra/persistence/prisma/prisma.service';
import { Booking } from '@domain/entities/booking.entity';
import { IBookingRepository } from '@domain/repository/booking.repository';
@Injectable()
export class BookingPrismaRepository implements IBookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Check if there are any bookings that overlap with the given time range.
   */
  async findOverlaps(
    startsAt: Date,
    endsAt: Date,
    opts?: { excludeId?: string },
  ): Promise<boolean> {
    const where = {
      AND: [{ startsAt: { lt: endsAt } }, { endsAt: { gt: startsAt } }],
      ...(opts?.excludeId ? { id: { not: opts.excludeId } } : {}),
    };

    const found = await this.prisma.booking.findFirst({
      where,
      select: { id: true },
    });

    return !!found;
  }

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

  async listByUser(userId: string): Promise<Booking[]> {
    const rows = await this.prisma.booking.findMany({
      where: { userId },
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

  async delete(id: string): Promise<void> {
    await this.prisma.booking.delete({ where: { id } });
  }
}
