import { IsString, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsString() title!: string;
  @IsDateString() startAt!: string;
  @IsDateString() endAt!: string;
  @IsString() userId!: string;
}
