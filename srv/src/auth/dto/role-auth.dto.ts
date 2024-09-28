import { ApiProperty } from "@nestjs/swagger";
import { $Enums } from "@prisma/client";
import { IsEmail, IsEnum } from "class-validator";

export class UpdateRoleAuthDto {
  @ApiProperty({
    example: "PARENT | TEACHER | ADMIN",
    description: "The role of the user",
    nullable: false,
    minLength: 4,
  })
  @IsEnum($Enums.Role)
  Role: $Enums.Role;

  @ApiProperty({
    example: "user@example.com",
    description: "The email address of the user",
    nullable: false,
  })
  @IsEmail()
  email: string;
}
