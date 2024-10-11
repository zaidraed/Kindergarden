import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail", // O cualquier servicio de correo que uses
      auth: {
        user: process.env.EMAIL_USER, // Tu correo desde .env
        pass: process.env.EMAIL_PASSWORD, // Tu contraseña desde .env
      },
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const url = `https://jardindelaestacion.vercel.app/=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Recuperación de contraseña",
      text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${url}`,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
