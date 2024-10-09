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

  const corsOptions: CorsOptions = {
    origin: ["http://localhost:5173"],
    credentials: true,
  };
  app.enableCors(corsOptions);
  credentials: true;

  await app.listen(3000);
}
bootstrap();
