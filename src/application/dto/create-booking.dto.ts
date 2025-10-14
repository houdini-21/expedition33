import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 'Meeting with team' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title!: string;

  @ApiProperty({ example: '2023-10-01T10:00:00Z' })
  @IsISO8601()
  startAt!: string;

  @ApiProperty({ example: '2023-10-01T11:00:00Z' })
  @IsISO8601()
  endAt!: string;

  @ApiProperty({ example: 'user-id-123' })
  @IsString()
  userId!: string;
}
