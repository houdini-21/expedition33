import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UnitOfWorkPort } from '@app/ports/unit-of-work.port';

@Injectable()
export class PrismaUnitOfWorkAdapter implements UnitOfWorkPort {
  constructor(private readonly prisma: PrismaService) {}

  async runInTransaction<T>(fn: () => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async () => {
      return fn();
    });
  }
}
