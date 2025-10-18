import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthModule as AuthInfraModule } from '@infra/auth/auth.module';
import { LoginWithGoogleCallbackUseCase } from '@app/use-cases/login-with-google-callback.usecase';
import { GetMeUseCase } from '@app/use-cases/get-me.usecase';
import { LogoutUseCase } from '@app/use-cases/logout.usecase';
@Module({
  imports: [AuthInfraModule],
  controllers: [AuthController],
  providers: [LoginWithGoogleCallbackUseCase, GetMeUseCase, LogoutUseCase],
})
export class AuthPresentationModule {}
