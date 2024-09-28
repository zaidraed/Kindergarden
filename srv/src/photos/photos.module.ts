import { Module } from "@nestjs/common";
import { PhotosService } from "./photos.service";
import { PhotosController } from "./photos.controller";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [PhotosController],
  providers: [PhotosService, CloudinaryService, PrismaService],
})
export class PhotosModule {}
