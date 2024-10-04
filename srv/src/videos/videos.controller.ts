import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { VideosService } from "./videos.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Controller("videos")
export class VideosController {
  constructor(
    private readonly videosService: VideosService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post("upload/:classroomId")
  @UseInterceptors(FileInterceptor("file"))
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Param("classroomId") classroomId: string,
    @Body("description") description: string
  ) {
    if (!file) {
      throw new BadRequestException("Missing required parameter - file");
    }

    const result = await this.cloudinaryService.uploadVideo(file, {
      folder: `classroom_${classroomId}`,
      resource_type: "video", // Asegúrate de que el tipo de recurso esté configurado como 'video'
    });

    const video = await this.videosService.create({
      url: result.secure_url,
      classroomId,
      description,
      publicId: result.public_id,
    });

    return video;
  }

  @Get("classroom/:classroomId")
  getVideosByClassroom(@Param("classroomId") classroomId: string) {
    return this.videosService.getVideosByClassroom(classroomId);
  }

  @Get("all")
  async getAllVideos() {
    const videos = await this.videosService.getAllVideos();
    return videos;
  }
}
