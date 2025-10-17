import { Controller, Get } from '@nestjs/common';

@Controller({ path: 'health', version: '1' })
export class HealthController {
  @Get()
  ping() {
    return { status: 'I feel so clean like a money machine' };
  }
}
