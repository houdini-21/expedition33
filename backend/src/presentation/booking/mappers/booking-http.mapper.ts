import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';
import { GetBookingsDto } from '../dto/get-bookings.dto';

import { CreateBookingCommand } from '@app/dto/commands/create-booking.command';
import { UpdateBookingCommand } from '@app/dto/commands/update-booking.command';
import { GetBookingsQuery } from '@app/dto/queries/get-bookings.query';
import { GetBookingByIdQuery } from '@app/dto/queries/get-booking-by-id.query';

export function toCreateCommand(
  dto: CreateBookingDto,
  userId: string,
): CreateBookingCommand {
  const startsAtStr = (dto as any).startsAt ?? (dto as any).startAt;
  const endsAtStr = (dto as any).endsAt ?? (dto as any).endAt;
  return {
    input: {
      userId,
      title: dto.title,
      startsAt: new Date(startsAtStr),
      endsAt: new Date(endsAtStr),
    },
  };
}

export function toUpdateCommand(
  id: string,
  dto: UpdateBookingDto,
  userId: string,
): UpdateBookingCommand {
  const startsAtStr = (dto as any).startsAt ?? (dto as any).startAt;
  const endsAtStr = (dto as any).endsAt ?? (dto as any).endAt;
  return {
    id,
    input: {
      userId,
      title: dto.title,
      startsAt: new Date(startsAtStr),
      endsAt: new Date(endsAtStr),
    },
  };
}

export function toGetBookingsQuery(
  dto: GetBookingsDto,
  userId: string,
): GetBookingsQuery {
  return {
    userId,
    from: dto.startsAt ? new Date(dto.startsAt) : undefined,
    to: dto.endsAt ? new Date(dto.endsAt) : undefined,
    status: 'active',
    page: 1,
    pageSize: 100,
  };
}

export function toGetByIdQuery(
  id: string,
  userId: string,
): GetBookingByIdQuery {
  return { id, userId };
}
