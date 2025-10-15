import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class GetBookingsByUserDto {
  @ApiProperty({
    description: 'User ID',
    example: 'user-123',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Start date for filtering bookings (ISO 8601 format)',
    example: '2023-10-01T00:00:00Z',
    required: false,
  })
  @IsISO8601()
  startAt?: Date;

  @ApiProperty({
    description: 'End date for filtering bookings (ISO 8601 format)',
    example: '2023-10-31T23:59:59Z',
    required: false,
  })
  @IsISO8601()
  endAt?: Date;

  @ApiProperty({
    description: 'Status ID for filtering bookings',
    example: 1,
    required: false,
  })
  statusId?: number;
}
