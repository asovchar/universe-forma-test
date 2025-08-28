import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import authConfig from './auth.config';

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(authConfig)],
      useFactory: (config: ConfigType<typeof authConfig>) => ({
        global: true,
        secret: config.jwt.secret,
        signOptions: {
          expiresIn: config.jwt.ttl,
        },
      }),
      inject: [authConfig.KEY],
    }),
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
