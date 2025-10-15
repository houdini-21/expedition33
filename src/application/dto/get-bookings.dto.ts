import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601 } from 'class-validator';

export class GetBookingsDto {
  @ApiProperty({ example: '2023-10-01T00:00:00Z' })
  @IsISO8601()
  startDate!: Date;

  @ApiProperty({ example: '2023-10-31T23:59:59Z' })
  @IsISO8601()
  endDate!: Date;
}
