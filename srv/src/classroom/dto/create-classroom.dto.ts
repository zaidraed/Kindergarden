import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateClassroomDto {
  @ApiProperty({ description: "The name of the classroom" })
  @IsString()
  name: string;

  @ApiProperty({ description: "The name of the teacher" })
  @IsString()
  teacherIds: string[]; // Un array para aceptar múltiples profesores
}
