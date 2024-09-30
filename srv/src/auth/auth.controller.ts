import { Controller, Post, Body, Res, Patch, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { Response } from "express";
import { Auth, GetUser } from "./decorator";
import { UpdateRoleAuthDto } from "./dto/role-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { User } from "./interfaces";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    description: "This endpoint is for create new users",
  })
  @Post("register")
  async create(@Body() createAuthDto: CreateAuthDto) {
    return await this.authService.create(createAuthDto);
  }

  @ApiOperation({
    description: "This endpoint is for login users",
  })
  @Post("login")
  async login(@Res() res: Response, @Body() loginAuthDto: LoginAuthDto) {
    await this.authService
      .login(loginAuthDto)
      .then((data) => {
        const { user, token } = data;
        return res
          .cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60,
          })
          .send(user);
      })
      .catch((e) => {
        throw e;
      });
  }
  @ApiOperation({
    description: "This endpoint is for getting all users",
  })
  @Get("users")
  // @Auth("ADMIN") // Solo permite a los usuarios con rol 'ADMIN' acceder
  async getAllUsers() {
    return await this.authService.getAllUsers();
  }

  @ApiOperation({
    description: "This enpoint is for update user Role",
  })
  @Patch("update-role")
  //@Auth("ADMIN")
  async updateRole(@Body() updateRoleAuthDto: UpdateRoleAuthDto) {
    return await this.authService.updateRole(updateRoleAuthDto);
  }

  @ApiOperation({
    description: "This enpoint is for update user",
  })
  @Patch()
  //@Auth()
  async update(@Body() updateAuthDto: UpdateAuthDto, @GetUser() user: User) {
    return await this.authService.update(updateAuthDto, user);
  }
}
