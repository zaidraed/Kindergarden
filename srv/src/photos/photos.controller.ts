import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Body,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { PhotosService } from "./photos.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Controller("photos")
export class PhotosController {
  constructor(
    private readonly photosService: PhotosService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post("upload/:classroomId")
  @UseInterceptors(FileInterceptor("file"))
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Param("classroomId") classroomId: string,
    @Body("description") description: string // Descripción pasada desde el frontend
  ) {
    const result = await this.cloudinaryService.uploadImage(file);
    const photo = await this.photosService.create({
      url: result.secure_url,
      classroomId,
      description, // Guardar la descripción proporcionada
    });
    return photo;
  }

  @Get("classroom/:classroomId")
  getPhotosByClassroom(@Param("classroomId") classroomId: string) {
    return this.photosService.getPhotosByClassroom(classroomId);
  }
  @Get("all")
  async getAllPhotos() {
    const photos = await this.photosService.getAllPhotos();
    return photos;
  }
}
