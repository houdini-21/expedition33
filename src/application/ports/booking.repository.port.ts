// Domain entity is intentionally not imported to keep this layer simple.
// If you have a Domain Booking entity, you can type it there instead.
export interface BookingRepositoryPort {
  existsOverlap(
    userId: string,
    startsAt: Date,
    endsAt: Date,
    excludeBookingId?: string,
  ): Promise<boolean>;
  findById(id: string): Promise<{
    id: string;
    title: string;
    startsAt: Date;
    endsAt: Date;
    userId: string;
    status: 'active' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
  } | null>;
  create(data: {
    title: string;
    startsAt: Date;
    endsAt: Date;
    userId: string;
  }): Promise<string>; // returns new id
  save(data: {
    id: string;
    title: string;
    startsAt: Date;
    endsAt: Date;
    status?: 'active' | 'cancelled';
  }): Promise<void>;
  cancel(id: string): Promise<void>;
  list(params: {
    userId: string;
    from?: Date;
    to?: Date;
    status?: 'active' | 'cancelled';
    page?: number;
    pageSize?: number;
  }): Promise<{
    data: Array<{
      id: string;
      title: string;
      startsAt: Date;
      endsAt: Date;
      userId: string;
      status: 'active' | 'cancelled';
      createdAt: Date;
      updatedAt: Date;
    }>;
    total: number;
    page: number;
    pageSize: number;
  }>;
}
