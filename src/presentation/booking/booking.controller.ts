import {
  Controller,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateBookingUseCase } from '@app/use-cases/create-booking.usecase';
import { CreateBookingDto } from '@app/dto/create-booking.dto';
import { created } from '@common/http/response.types';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Bookings')
@UseGuards(AuthGuard('jwt'))
@Controller('bookings')
export class BookingController {
  constructor(private readonly createBooking: CreateBookingUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a booking' })
  @ApiConsumes('application/json')
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({ status: 201, description: 'Created' })
  async create(@Req() req: any, @Body() dto: CreateBookingDto) {
    const userId = req.user.userId;
    const result = await this.createBooking.execute({ ...dto, userId });
    return created(result);
  }
}
