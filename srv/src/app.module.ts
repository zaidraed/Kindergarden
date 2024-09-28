import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { PhotosModule } from "./photos/photos.module";
import { CloudinaryModule } from "./cloudinary/cloudinary.module";

@Module({
  imports: [PrismaModule, AuthModule, PhotosModule, CloudinaryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
