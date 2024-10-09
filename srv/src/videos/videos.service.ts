import { Injectable } from "@nestjs/common";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { PrismaService } from "../prisma/prisma.service";
import { Video } from "@prisma/client";

@Injectable()
export class VideosService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly prisma: PrismaService
  ) {}

  async create(data: {
    url: string;
    classroomId: string;
    description: string;
    publicId: string;
  }): Promise<Video> {
    return this.prisma.video.create({
      data: {
        url: data.url,
        classroomId: data.classroomId,
        description: data.description,
        publicId: data.publicId,
        createdAt: new Date(),
      },
    });
  }

  async getVideosByClassroom(classroomId: string) {
    return this.prisma.video.findMany({
      where: { classroomId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getAllVideos(): Promise<Video[]> {
    return this.prisma.video.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async deleteVideo(id: string): Promise<void> {
    const video = await this.prisma.video.findUnique({ where: { id } });
    if (video) {
      await this.cloudinaryService.deleteVideo(video.publicId);
      await this.prisma.video.delete({ where: { id } });
    }
  }
}
