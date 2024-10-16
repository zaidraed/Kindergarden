import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { PhotosModule } from "./photos/photos.module";
import { CloudinaryModule } from "./cloudinary/cloudinary.module";
import { VideosModule } from "./videos/videos.module";
import { ClassroomModule } from "./classroom/classroom.module";
import { MailModule } from "./mail/mail.module";
import { GoogleStrategy } from "./auth/strategies/google.strategy";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    PhotosModule,
    CloudinaryModule,
    VideosModule,
    ClassroomModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule {}
