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
import {
  comparePasswordHashing,
  hashingPassword,
} from "src/common/hashing-password";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
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

  async update(updateAuthDto: UpdateAuthDto, user: User) {
    updateAuthDto.password = await hashingPassword(updateAuthDto.password);
    return await this.prisma.users
      .update({
        where: {
          id: user.id,
        },
        data: updateAuthDto,
      })
      .catch((e) => {
        handleErrorExceptions(e);
      });
  }
}
