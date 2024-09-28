import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";

import { ExtractJwt, Strategy } from "passport-jwt";

import { type User, type IJwtPayload } from "../interfaces";
import { PrismaService } from "../../prisma/prisma.service";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prismaService: PrismaService,
    configService: ConfigService
  ) {
    super({
      secretOrKey: configService.get("SECRET_JWT_KEY"),
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookies,
      ]),
    });
  }

  private static extractJWTFromCookies(req: Request): string | null {
    if (req.cookies && req.cookies.access_token) {
      console.log(req.cookies);

      return req.cookies.access_token;
    }
    return null;
  }

  async validate({ id }: IJwtPayload): Promise<User> {
    const user = await this.prismaService.users.findUnique({ where: { id } });

    if (!user) throw new UnauthorizedException("Token not valid");
    // if (!user.is_active) throw new UnauthorizedException('User is inactive')
    // if (!user.is_verified) throw new UnauthorizedException('Unveried user')
    delete user.password;
    const { id: idUser, ...rest } = user;

    return { ...rest, id: idUser };
  }
}
