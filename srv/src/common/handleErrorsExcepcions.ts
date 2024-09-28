import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JsonWebTokenError } from "jsonwebtoken";

export const handleErrorExceptions = (error: unknown) => {
  if (error instanceof NotFoundException)
    throw new NotFoundException(error.message);
  if (error instanceof UnauthorizedException)
    throw new UnauthorizedException(error.message);
  if (error instanceof ConflictException)
    throw new ConflictException(error.message);
  if (error instanceof JsonWebTokenError)
    throw new UnauthorizedException("Invalid token");

  // Manejo específico de errores de Prisma
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2002")
      throw new ConflictException("Email already used");
    if (error.code === "P2005")
      throw new ConflictException("Record to delete does not exist.");
  }

  // Error general para cualquier otro caso
  throw new InternalServerErrorException("An unexpected error occurred");
};
