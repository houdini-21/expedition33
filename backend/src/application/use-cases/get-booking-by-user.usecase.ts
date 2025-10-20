import { Inject, Injectable } from '@nestjs/common';
import { BOOKING_REPOSITORY } from '@domain/repository/booking.repository';
import type { IBookingRepository } from '@domain/repository/booking.repository';

@Injectable()
export class GetBookingsByUserUseCase {
  constructor(@Inject(BOOKING_REPOSITORY) private repo: IBookingRepository) {}

  /**
   * The `listByUser` function retrieves a list of items based on the user ID, start and end dates, and
   * optional status ID.
   * @param {string} userId - The `userId` parameter is a string that represents the unique identifier of
   * a user for whom you want to retrieve a list of items.
   * @param {string} startsAt - The `startsAt` parameter is a string representing the starting date and
   * time for the list of items to be retrieved.
   * @param {string} endsAt - The `endsAt` parameter is a string representing the end date and time for
   * the range of data you want to retrieve. It is converted to a `Date` object using `new Date(endsAt)`
   * before being passed to the `listByUser` method.
   * @param {number} [statusId] - The `statusId` parameter in the `listByUser` function is an optional
   * parameter of type number. It allows you to filter the list of items based on a specific status ID if
   * provided. If no `statusId` is provided, the function will return all items within the specified time
   * range
   * @returns The `listByUser` method is being called on `this.repo` with the provided `userId`,
   * `startsAt`, `endsAt`, and optional `statusId` parameters. The method returns the result of this
   * call.
   */
  async listByUser(
    userId: string,
    startsAt: string,
    endsAt: string,
    statusId?: number,
  ) {
    return this.repo.listByUser(
      userId,
      new Date(startsAt),
      new Date(endsAt),
      statusId,
    );
  }
}
