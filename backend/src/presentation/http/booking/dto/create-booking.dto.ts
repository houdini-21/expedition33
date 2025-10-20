import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, MinLength } from 'class-validator';

// DTO for creating a new booking
export class CreateBookingDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(2)
  title!: string;

  @ApiProperty({ example: '2025-12-01T10:00:00Z' })
  @IsISO8601()
  startsAt!: string;

  @ApiProperty({ example: '2025-12-01T11:00:00Z' })
  @IsISO8601()
  endsAt!: string;
}
