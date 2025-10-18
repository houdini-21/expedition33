import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { GetBookingsDto } from './dto/get-bookings.dto';
import { ok, created } from '@common/http/response.types';

import {
  toCreateCommand,
  toUpdateCommand,
  toGetBookingsQuery,
  toGetByIdQuery,
} from './mappers/booking-http.mapper';

import { CreateBookingUseCase } from '@app/use-cases/create-booking.usecase';
import { UpdateBookingUseCase } from '@app/use-cases/update-booking.usecase';
import { CancelBookingUseCase } from '@app/use-cases/cancel-booking.usecase';
import { GetBookingsUseCase } from '@app/use-cases/get-bookings.usecase';
import { GetBookingByIdUseCase } from '@app/use-cases/get-booking-by-id.usecase';

@ApiTags('bookings')
@Controller('bookings')
@UseGuards(AuthGuard('jwt'))
export class BookingController {
  constructor(
    private readonly createBooking: CreateBookingUseCase,
    private readonly updateBooking: UpdateBookingUseCase,
    private readonly cancelBooking: CancelBookingUseCase,
    private readonly getBookings: GetBookingsUseCase,
    private readonly getBookingById: GetBookingByIdUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List bookings of current user' })
  async list(@Req() req: any, @Query() dto: GetBookingsDto) {
    const query = toGetBookingsQuery(dto, req.user.userId);
    const result = await this.getBookings.execute(query);
    return ok(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by id' })
  async getOne(@Req() req: any, @Param('id') id: string) {
    const query = toGetByIdQuery(id, req.user.userId);
    const result = await this.getBookingById.execute(query);
    return ok(result);
  }

  @Post()
  @ApiOperation({ summary: 'Create a booking' })
  @ApiResponse({ status: 201, description: 'Created' })
  async create(@Req() req: any, @Body() dto: CreateBookingDto) {
    const cmd = toCreateCommand(dto, req.user.userId);
    const result = await this.createBooking.execute(cmd);
    return created(result);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a booking' })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateBookingDto,
  ) {
    const cmd = toUpdateCommand(id, dto, req.user.userId);
    const result = await this.updateBooking.execute(cmd);
    return ok(result);
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel a booking' })
  async cancel(@Req() req: any, @Param('id') id: string) {
    await this.cancelBooking.execute({
      id,
      input: { userId: req.user.userId },
    });
    return ok({ message: 'Cancelled' });
  }
}
