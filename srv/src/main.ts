import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

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
    origin: ['https://https://kindergarden-red.vercel.app/login'], // Aquí pones tu URL de Vercel o frontend permitido
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Si estás usando cookies o autenticación basada en sesiones
  };

  await app.listen(3000);
}
bootstrap();
