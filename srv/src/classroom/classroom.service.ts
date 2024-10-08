import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateClassroomDto } from "./dto/create-classroom.dto";
import { UpdateClassroomDto } from "./dto/update-classroom.dto";

@Injectable()
export class ClassroomService {
  constructor(private prisma: PrismaService) {}

  async create(createClassroomDto: CreateClassroomDto) {
    const classroom = await this.prisma.classroom.create({
      data: {
        name: createClassroomDto.name,
      },
    });

    // Log para ver si se procesan correctamente los teacherIds
    console.log(
      "Creando relaciones en ClassroomTeacher con teacherIds:",
      createClassroomDto.teacherIds
    );

    // Crear las relaciones en ClassroomTeacher
    await Promise.all(
      createClassroomDto.teacherIds.map((teacherId) => {
        console.log(
          `Creando relación para aula ${classroom.id} con profesor ${teacherId}`
        );
        return this.prisma.classroomTeacher.create({
          data: {
            classroomId: classroom.id,
            userId: teacherId,
          },
        });
      })
    );

    return classroom;
  }

  findAll() {
    return this.prisma.classroom.findMany({
      include: {
        teachers: {
          include: {
            user: true, // Incluir información del profesor
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.classroom.findUnique({
      where: { id },
      include: {
        teachers: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async update(id: string, updateClassroomDto: UpdateClassroomDto) {
    // Actualizar el nombre del aula
    const classroom = await this.prisma.classroom.update({
      where: { id },
      data: {
        name: updateClassroomDto.name,
      },
    });

    // Eliminar las relaciones existentes de profesores
    await this.prisma.classroomTeacher.deleteMany({
      where: { classroomId: id },
    });

    // Asociar los nuevos profesores
    await Promise.all(
      updateClassroomDto.teacherIds.map((teacherId) =>
        this.prisma.classroomTeacher.create({
          data: {
            classroomId: id,
            userId: teacherId,
          },
        })
      )
    );

    return classroom;
  }

  async remove(id: string) {
    // Primero, eliminamos todas las relaciones ClassroomTeacher asociadas
    await this.prisma.classroomTeacher.deleteMany({
      where: { classroomId: id },
    });

    // Luego, eliminamos el aula
    return this.prisma.classroom.delete({
      where: { id },
    });
  }
}
