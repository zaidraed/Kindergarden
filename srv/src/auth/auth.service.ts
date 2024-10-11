import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { PrismaService } from "../prisma/prisma.service";
import { handleErrorExceptions } from "../common/handleErrorsExcepcions";
// import { compare } from 'bcrypt'
import { LoginAuthDto } from "./dto/login-auth.dto";
import { sign } from "jsonwebtoken";
import { UpdateRoleAuthDto } from "./dto/role-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { User } from "./interfaces";
import { JwtService } from "@nestjs/jwt";
import {
  comparePasswordHashing,
  hashingPassword,
} from "src/common/hashing-password";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}
  async create(createAuthDto: CreateAuthDto) {
    // const password = await hash(createAuthDto.password, parseInt(process.env.SALT_ROUNDS))
    // createAuthDto.password = password

    createAuthDto.password = await hashingPassword(createAuthDto.password);
    try {
      const email = await this.findUserByEmail(createAuthDto.email);
      if (email) throw new ConflictException("Email already used");

      return this.prisma.users.create({
        data: createAuthDto,
        select: { email: true },
      });
    } catch (error) {
      handleErrorExceptions(error);
    }
  }
  // Método para obtener todos los usuarios
  async getAllUsers() {
    return this.prisma.users.findMany(); // Asumiendo que tienes un modelo 'user'
  }

  async findUserByEmail(email: string) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { email },
      });

      return user;
    } catch (error) {
      handleErrorExceptions(error);
    }
  }

  async login(loginAuthDto: LoginAuthDto) {
    try {
      const data = await this.findUserByEmail(loginAuthDto.email);
      if (!data) throw new NotFoundException("User not Found");

      const { password, id, ...user } = data;

      const correctPassword = await comparePasswordHashing(
        loginAuthDto.password,
        password
      );

      if (!correctPassword)
        throw new BadRequestException("Invalid Credentials");

      const secret = process.env.SECRET_JWT_KEY;
      const token = sign(
        {
          id,
        },
        secret,
        {
          expiresIn: "1h",
        }
      );
      return {
        user: { ...user },
        token,
      };
    } catch (error) {
      handleErrorExceptions(error);
    }
  }

  async updateRole(updateRoleAuthDto: UpdateRoleAuthDto) {
    try {
      const user = await this.findUserByEmail(updateRoleAuthDto.email);
      if (!user) throw new NotFoundException("User not Exist");

      return await this.prisma.users.update({
        where: {
          email: updateRoleAuthDto.email,
        },
        data: {
          Role: updateRoleAuthDto.Role,
        },
        select: {
          Role: true,
        },
      });
    } catch (error) {
      handleErrorExceptions(error);
    }
  }

  async toggleUserActive(email: string) {
    // Buscar al usuario por email
    const user = await this.findUserByEmail(email);
    if (!user) throw new NotFoundException("User not found");

    // Alternar el valor de Active
    const newActiveStatus = !user.Active;

    return this.prisma.users.update({
      where: { email },
      data: { Active: newActiveStatus },
    });
  }
  async googleLogin(req) {
    if (!req.user) {
      throw new BadRequestException("Google login failed");
    }

    const { email, firstName, lastName } = req.user;
    let user = await this.prisma.users.findUnique({ where: { email } });

    if (!user) {
      user = await this.prisma.users.create({
        data: {
          email,
          name: `${firstName} ${lastName}`,
          password: null, // Google users will not have a password
        },
      });
    }

    return this.generateJwtToken(user);
  }

  private generateJwtToken(user) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async generateResetToken(email: string): Promise<string> {
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException("Usuario no encontrado");
    }

    const resetToken = uuidv4(); // Genera un token único
    await this.prisma.users.update({
      where: { email },
      data: { resetPasswordToken: resetToken }, // Guarda el token en el campo correspondiente
    });

    return resetToken;
  }

  async resetPassword(resetPasswordDto: {
    token: string;
    newPassword: string;
  }) {
    const { token, newPassword } = resetPasswordDto;

    // Buscar al usuario por el token
    const user = await this.prisma.users.findFirst({
      where: { resetPasswordToken: token },
    });

    if (!user) {
      throw new BadRequestException("Token inválido o expirado");
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña del usuario y limpiar el token
    await this.prisma.users.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null, // Limpiar el token después de usarlo
      },
    });

    return { message: "Contraseña restablecida con éxito" };
  }
}
