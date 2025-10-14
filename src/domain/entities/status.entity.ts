export class Status {
  constructor(
    public readonly id: number,
    public name: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}
}
