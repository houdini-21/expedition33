import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';
import { GetBookingsDto } from '../dto/get-bookings.dto';
import { CreateBookingCommand } from '../../../../application/dto/commands/create-booking.command';
import { UpdateBookingCommand } from '../../../../application/dto/commands/update-booking.command';
import { GetBookingsQuery } from '../../../../application/dto/queries/get-bookings.query';
import { GetBookingByIdQuery } from '../../../../application/dto/queries/get-booking-by-id.query';

// Mapper functions to convert HTTP DTOs to application commands/queries

export function toCreateCommand(
  dto: CreateBookingDto,
  userId: string,
): CreateBookingCommand {
  return {
    input: {
      userId,
      title: dto.title,
      startsAt: new Date(dto.startsAt),
      endsAt: new Date(dto.endsAt),
    },
  };
}

export function toUpdateCommand(
  id: string,
  dto: UpdateBookingDto,
  userId: string,
): UpdateBookingCommand {
  return {
    id,
    input: {
      userId,
      title: dto.title,
      startsAt: new Date(dto.startsAt),
      endsAt: new Date(dto.endsAt),
    },
  };
}

export function toGetBookingsQuery(
  dto: GetBookingsDto,
  userId: string,
): GetBookingsQuery {
  return {
    userId,
    from: dto.from ? new Date(dto.from) : undefined,
    to: dto.to ? new Date(dto.to) : undefined,
    status: dto.status,
    page: dto.page,
    pageSize: dto.pageSize,
  };
}

export function toGetByIdQuery(
  id: string,
  userId: string,
): GetBookingByIdQuery {
  return { id, userId };
}
