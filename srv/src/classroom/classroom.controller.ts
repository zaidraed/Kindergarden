import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { ClassroomService } from "./classroom.service";
import { CreateClassroomDto } from "./dto/create-classroom.dto";
import { UpdateClassroomDto } from "./dto/update-classroom.dto";
//import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@ApiTags("classrooms")
@Controller("classrooms")
// @UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Post()
  @ApiOperation({ summary: "Create a new classroom" })
  @ApiResponse({
    status: 201,
    description: "The classroom has been successfully created.",
  })
  create(@Body() createClassroomDto: CreateClassroomDto) {
    console.log("Datos recibidos en la creación:", createClassroomDto);

    return this.classroomService.create(createClassroomDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all classrooms" })
  @ApiResponse({ status: 200, description: "Return all classrooms." })
  findAll() {
    return this.classroomService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a classroom by id" })
  @ApiResponse({ status: 200, description: "Return the classroom." })
  findOne(@Param("id") id: string) {
    return this.classroomService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a classroom" })
  @ApiResponse({
    status: 200,
    description: "The classroom has been successfully updated.",
  })
  update(
    @Param("id") id: string,
    @Body() updateClassroomDto: UpdateClassroomDto
  ) {
    return this.classroomService.update(id, updateClassroomDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a classroom" })
  @ApiResponse({
    status: 200,
    description: "The classroom has been successfully deleted.",
  })
  remove(@Param("id") id: string) {
    return this.classroomService.remove(id);
  }
}
