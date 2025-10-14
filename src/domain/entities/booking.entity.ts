export class Booking {
  constructor(
    public readonly id: string,
    public title: string,
    public startsAt: Date,
    public endsAt: Date,
    public userId: string,
    public statusId: number,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}
}
