import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { PhotosModule } from "./photos/photos.module";
import { CloudinaryModule } from "./cloudinary/cloudinary.module";
import { VideosModule } from './videos/videos.module';
import { ClassroomModule } from './classroom/classroom.module';

@Module({
  imports: [PrismaModule, AuthModule, PhotosModule, CloudinaryModule, VideosModule, ClassroomModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
