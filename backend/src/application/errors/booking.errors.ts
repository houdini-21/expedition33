export class BookingNotFoundError extends Error {
  constructor() {
    super('Booking not found');
    this.name = 'BookingNotFoundError';
  }
}

export class OverlappingBookingError extends Error {
  constructor() {
    super('Booking overlaps an existing one');
    this.name = 'OverlappingBookingError';
  }
}

export class NotOwnerError extends Error {
  constructor() {
    super('You are not allowed to operate on this booking');
    this.name = 'NotOwnerError';
  }
}

export class BookingCancelledError extends Error {
  constructor() {
    super('Booking is already cancelled');
    this.name = 'BookingCancelledError';
  }
}
