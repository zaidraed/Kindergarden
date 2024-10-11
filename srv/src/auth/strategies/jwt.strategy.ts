import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt"; // Este es el correcto para JWT
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
import { type User, type IJwtPayload } from "../interfaces";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService
  ) {
    super({
      secretOrKey: configService.get("SECRET_JWT_KEY"), // Obtén la clave secreta del archivo .env
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookies,
      ]),
    });
  }

  private static extractJWTFromCookies(req: Request): string | null {
    if (req.cookies && req.cookies.access_token) {
      return req.cookies.access_token;
    }
    return null;
  }

  async validate({ id }: IJwtPayload): Promise<User> {
    const user = await this.prismaService.users.findUnique({ where: { id } });

    if (!user) throw new UnauthorizedException("Token no válido");
    delete user.password;

    return user;
  }
}
