import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { MailModule } from "../mail/mail.module";
import { GoogleStrategy } from "./strategies/google.strategy";
import { PrismaService } from "src/prisma/prisma.service";
import { OAuth2Client } from "google-auth-library";

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    PrismaService,
    {
      provide: OAuth2Client,
      useValue: new OAuth2Client(
        "566063083458-51k9fvuupd3kju0klptht1p5ocuppqu7.apps.googleusercontent.com"
      ),
    },
  ],
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule, MailModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("SECRET_JWT_KEY"),
        signOptions: {
          expiresIn: configService.get("JWT_REFRESH_EXPIRATION"),
        },
      }),
    }),
    PrismaModule,
    MailModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
