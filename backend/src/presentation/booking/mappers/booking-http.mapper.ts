import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';
import { GetBookingsDto } from '../dto/get-bookings.dto';

import { CreateBookingCommand } from '@app/dto/commands/create-booking.command';
import { UpdateBookingCommand } from '@app/dto/commands/update-booking.command';
import { GetBookingsQuery } from '@app/dto/queries/get-bookings.query';
import { GetBookingByIdQuery } from '@app/dto/queries/get-booking-by-id.query';

/**
 * The function `toCreateCommand` converts a `CreateBookingDto` object into a `CreateBookingCommand`
 * object by extracting relevant properties and parsing date strings.
 * @param {CreateBookingDto} dto - The `dto` parameter in the `toCreateCommand` function is of type
 * `CreateBookingDto`, which likely contains information needed to create a booking such as title,
 * start time, and end time.
 * @param {string} userId - The `userId` parameter in the `toCreateCommand` function is a string
 * representing the user ID of the user creating the booking.
 * @returns A CreateBookingCommand object is being returned, which contains an input object with
 * userId, title, startsAt, and endsAt properties based on the provided CreateBookingDto and userId
 * parameters. The startsAt and endsAt properties are converted to Date objects using the values from
 * the dto parameter.
 */
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

/**
 * The function `toUpdateCommand` takes in an ID, a data transfer object, and a user ID to create an
 * update booking command object.
 * @param {string} id - The `id` parameter is a string representing the identifier of the booking that
 * needs to be updated.
 * @param {UpdateBookingDto} dto - The `dto` parameter in the `toUpdateCommand` function stands for the
 * data transfer object that contains the information needed to update a booking. It likely includes
 * properties such as `title`, `startsAt`, and `endsAt` for the booking being updated.
 * @param {string} userId - The `userId` parameter in the `toUpdateCommand` function represents the
 * unique identifier of the user who is updating the booking. This identifier is used to associate the
 * update operation with a specific user in the system.
 * @returns An `UpdateBookingCommand` object is being returned, which contains the `id` of the booking
 * to update and an `input` object with the updated booking information including the `userId`,
 * `title`, `startsAt`, and `endsAt` properties. The `startsAt` and `endsAt` properties are converted
 * to `Date` objects based on the values extracted from the `dto`
 */
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

/**
 * This TypeScript function generates a query object for fetching bookings based on provided
 * parameters.
 * @param {GetBookingsDto} dto - The `dto` parameter in the `toGetBookingsQuery` function stands for
 * Data Transfer Object. It is used to pass data between different parts of a program or between
 * different systems. In this context, the `GetBookingsDto` represents the data transfer object for
 * getting bookings.
 * @param {string} userId - The `userId` parameter is a string representing the user ID for which the
 * bookings are being retrieved.
 * @returns A `GetBookingsQuery` object is being returned with the following properties:
 * - `userId` set to the provided `userId` parameter
 * - `from` set to a `Date` object created from `dto.startsAt` if it exists, otherwise set to
 * `undefined`
 * - `to` set to a `Date` object created from `dto.endsAt` if it exists,
 */
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

/**
 * The function `toGetByIdQuery` creates a `GetBookingByIdQuery` object with the provided `id` and
 * `userId` values.
 * @param {string} id - The `id` parameter is a string that represents the unique identifier of a
 * booking.
 * @param {string} userId - The `userId` parameter in the `toGetByIdQuery` function represents the user
 * ID of the user making the request. This parameter is used to identify which user is trying to
 * retrieve a booking by its ID.
 * @returns A GetBookingByIdQuery object with the provided id and userId values.
 */
export function toGetByIdQuery(
  id: string,
  userId: string,
): GetBookingByIdQuery {
  return { id, userId };
}
