import {
  Controller,
  Post,
  Body,
  Res,
  Patch,
  Get,
  UseGuards,
  Req,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { Response } from "express";
import { Auth, GetUser } from "./decorator";
import { UpdateRoleAuthDto } from "./dto/role-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { User } from "./interfaces";
import { AuthGuard } from "@nestjs/passport";
import { MailService } from "../mail/mail.service";
import { ConfigService } from "@nestjs/config";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService
  ) {}

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
    description: "This enpoint is for toggling user status",
  })
  @Patch("toggle-active")
  // @Auth() // Si necesitas autenticación
  async toggleUserActive(@Body("email") email: string) {
    return this.authService.toggleUserActive(email);
  }

  @ApiOperation({
    description: "This endpoint is for logging in with Google",
  })
  @Get("google/login")
  @UseGuards(AuthGuard("google"))
  async googleLogin() {
    // This method stays empty as it will be handled by Passport
  }

  @ApiOperation({
    description: "This endpoint is for handling the Google callback",
  })
  @Get("google/redirect")
  @UseGuards(AuthGuard("google"))
  async googleAuthRedirect(@Req() req, @Res() res) {
    try {
      const loginResult = await this.authService.googleLogin(req);
      const token = loginResult.access_token;

      // Redirect to the frontend with the token
      res.redirect(`https://jardindelaestacion.vercel.app/auth?token=${token}`);
    } catch (error) {
      console.error("Error in Google authentication:", error);
      throw new InternalServerErrorException(
        "Error processing Google authentication"
      );
    }
  }

  @Post("forgot-password")
  async forgotPassword(@Body("email") email: string) {
    try {
      const token = await this.authService.generateResetToken(email);
      await this.mailService.sendPasswordResetEmail(email, token);
      return { message: "Correo enviado para recuperación de contraseña" };
    } catch (error) {
      if (error.message === "No user found with this email") {
        throw new NotFoundException(error.message);
      }
      // Log the error for debugging
      console.error("Error in forgotPassword:", error);
      throw new InternalServerErrorException(
        "Error processing forgot password request"
      );
    }
  }
  @Post("validate-token")
  async validateToken(@Body("token") token: string) {
    return this.authService.validateToken(token);
  }

  // Restablecer contraseña con token
  @Post("reset-password")
  async resetPassword(
    @Body() resetPasswordDto: { token: string; newPassword: string }
  ) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
