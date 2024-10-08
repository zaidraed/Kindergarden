import { PartialType } from "@nestjs/swagger";
import { CreateClassroomDto } from "./create-classroom.dto";

export class UpdateClassroomDto {
  name?: string;
  teacherIds: string[]; // Un array para actualizar los profesores
}
