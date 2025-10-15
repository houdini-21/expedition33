import {
  Controller,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
  Param,
  Get,
  Query,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateBookingUseCase } from '@app/use-cases/create-booking.usecase';
import { CancelBookingUseCase } from '@app/use-cases/cancel-booking.usecase';
import { UpdateBookingUseCase } from '@app/use-cases/update-booking.usecase';
import { GetBookingsUseCase } from '@app/use-cases/get-bookings.usecase';
import { GetBookingsByUserUseCase } from '@app/use-cases/get-booking-by-user.usecase';
import { CreateBookingDto } from '@app/dto/create-booking.dto';
import { UpdateBookingDto } from '@app/dto/update-booking.dto';
import { GetBookingsDto } from '@app/dto/get-bookings.dto';
import { GetBookingsByUserDto } from '@app/dto/get-booking-by-user.dto';
import { created, ok } from '@common/http/response.types';
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
  constructor(
    private readonly createBooking: CreateBookingUseCase,
    private readonly cancelBooking: CancelBookingUseCase,
    private readonly updateBooking: UpdateBookingUseCase,
    private readonly getBookings: GetBookingsUseCase,
    private readonly getBookingsByUser: GetBookingsByUserUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiResponse({ status: HttpStatus.OK, description: 'OK' })
  async findAll(@Query() query: GetBookingsDto) {
    const result = await this.getBookings.listAllOverlappingBookings(
      query.startsAt,
      query.endsAt,
    );
    return ok(result);
  }

  @Get('user/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a booking by user ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'OK' })
  async findByUser(
    @Param('id') id: string,
    @Query() query: GetBookingsByUserDto,
  ) {
    const result = await this.getBookingsByUser.listByUser(
      id,
      query.startsAt,
      query.endsAt,
      query.statusId,
    );
    return ok(result);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a booking' })
  @ApiConsumes('application/json')
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Created' })
  async create(@Req() req: any, @Body() dto: CreateBookingDto) {
    const userId = req.user.userId;
    const result = await this.createBooking.create({ ...dto, userId });
    return created(result);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a booking' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Updated' })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateBookingDto,
  ) {
    const userId = req.user.userId;
    const result = await this.updateBooking.update(id, {
      ...dto,
      userId,
    });
    return ok(result);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Cancelled' })
  async cancel(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId as string;
    const result = await this.cancelBooking.cancel(id, userId);
    return ok(result);
  }
}
