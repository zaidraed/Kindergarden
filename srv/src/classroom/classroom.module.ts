import { Module } from "@nestjs/common";
import { ClassroomController } from "./classroom.controller";
import { ClassroomService } from "./classroom.service";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [ClassroomController],
  providers: [ClassroomService, PrismaService],
})
export class ClassroomModule {}
