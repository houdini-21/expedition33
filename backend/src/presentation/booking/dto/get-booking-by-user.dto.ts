import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsOptional } from 'class-validator';

export class GetBookingsByUserDto {
  @ApiProperty({
    description: 'Start date for filtering bookings (ISO 8601 format)',
    example: '2023-10-01T00:00:00Z',
  })
  @IsNotEmpty()
  @IsISO8601()
  startsAt: string;

  @ApiProperty({
    description: 'End date for filtering bookings (ISO 8601 format)',
    example: '2023-10-31T23:59:59Z',
  })
  @IsNotEmpty()
  @IsISO8601()
  endsAt: string;

  @ApiProperty({
    description: 'Status ID for filtering bookings',
    example: 1,
    required: false,
  })
  @IsOptional()
  statusId?: number;
}
