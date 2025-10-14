import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateBookingUseCase } from '@app/use-cases/create-booking.usecase';
import { CreateBookingDto } from '@app/dto/create-booking.dto';
import { created } from '@common/http/response.types';

@Controller('bookings')
@UseGuards(AuthGuard('jwt'))
export class BookingController {
  constructor(private readonly createBooking: CreateBookingUseCase) {}

  @Post()
  async create(@Req() req: any, @Body() dto: CreateBookingDto) {
    const userId = req.user.userId;
    const result = await this.createBooking.execute({ ...dto, userId });
    return created(result);
  }
}
