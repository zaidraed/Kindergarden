import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";

@Module({
  providers: [MailService], // Define MailService como provider
  exports: [MailService], // Exporta MailService para que otros módulos puedan usarlo
})
export class MailModule {}
