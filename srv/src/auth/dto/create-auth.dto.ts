import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class CreateAuthDto {
  // @ApiProperty({
  //   example: 'Pablito',
  //   description: 'The username of the user',
  //   nullable: false,
  //   minLength: 1,
  // })
  // @IsString()
  // username: string

  @ApiProperty({
    example: "test@gmail.com",
    description: "The email of the user",
    nullable: false,
    minLength: 1,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "123456b2@",
    description: "The password of the user",
    nullable: false,
    minLength: 6,
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: "Alexander",
    description: "The name of user",
    nullable: false,
    minLength: 3,
  })
  @IsString()
  name: string;
}
