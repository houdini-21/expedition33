import { Body, Controller, Post } from '@nestjs/common';
import { CreateBookingUseCase } from '@app/use-cases/create-booking.usecase';
import { CreateBookingDto } from '@app/dto/create-booking.dto';
import { created } from '@common/http/response.types';

@Controller('bookings')
export class BookingController {
  constructor(private createBooking: CreateBookingUseCase) {}

  @Post()
  async create(@Body() dto: CreateBookingDto) {
    const result = await this.createBooking.execute(dto);
    return created(result);
  }
}
