export class Account {
  constructor(
    public readonly id: string,
    public readonly provider: 'google',
    public readonly providerAccountId: string,
    public readonly expiresAt?: Date | null,
  ) {}
}
