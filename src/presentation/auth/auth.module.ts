import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthModule as AuthInfraModule } from '@infra/auth/auth.module';

@Module({
  imports: [AuthInfraModule],
  controllers: [AuthController],
})
export class AuthPresentationModule {}
