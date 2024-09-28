import { Injectable } from "@nestjs/common";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { PrismaService } from "../prisma/prisma.service";
import { UploadApiResponse } from "cloudinary";
import { Photo } from "@prisma/client";

@Injectable()
export class PhotosService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly prisma: PrismaService
  ) {}
  async create(data: {
    url: string;
    classroomId: string;
    description: string;
  }): Promise<Photo> {
    return this.prisma.photo.create({
      data: {
        url: data.url,
        classroomId: data.classroomId,
        description: data.description,
      },
    });
  }

  async uploadPhoto(
    file: Express.Multer.File,
    classroomId: string,
    description?: "Foto subida por el profesor"
  ) {
    // Subir la foto a Cloudinary
    const result = await this.cloudinaryService.uploadImage(file);

    // Guardar la información de la foto en la base de datos
    const photo = await this.prisma.photo.create({
      data: {
        url: result.secure_url, // Asegúrate de que `result` tenga el tipo correcto
        classroomId: classroomId,
        description: description,
      },
    });

    return photo;
  }

  async getPhotosByClassroom(classroomId: string) {
    return this.prisma.photo.findMany({
      where: { classroomId },
    });
  }
  async getAllPhotos(): Promise<Photo[]> {
    return this.prisma.photo.findMany();
  }
}
