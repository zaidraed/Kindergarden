import { Module } from "@nestjs/common";
import { VideosService } from "./videos.service";
import { VideosController } from "./videos.controller";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [VideosController],
  providers: [VideosService, CloudinaryService, PrismaService],
})
export class VideosModule {}
