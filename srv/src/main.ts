import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle("API Kinder")
    .setDescription("Kinder API ")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  app.enableCors({
    origin: 'https://kindergarden-production.up.railway.app', // Permite este dominio
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS', // Métodos HTTP permitidos
    credentials: true, // Permitir credenciales (cookies, autenticación)
    allowedHeaders: 'Content-Type, Authorization', // Cabeceras permitidas
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
