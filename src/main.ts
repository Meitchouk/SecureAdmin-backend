import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { PrismaService } from "./prisma/prisma.service";
import { Response } from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Establecer prefijo global para la API
  app.setGlobalPrefix('api');

  // Habilitar CORS para localhost y un dominio futuro
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://secure-admin-frontend-cd2f018cd39c.herokuapp.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  // Usar un ValidationPipe global para validaciones automáticas de DTOs
  app.useGlobalPipes(new ValidationPipe());

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('SecureAdmin API')
    .setDescription('API para la gestión de usuarios y roles en SecureAdmin')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Middleware para redirigir desde la raíz a la documentación de Swagger
  app.use('/', (req: { path: string; }, res: Response, next: () => void) => {
    if (req.path === '/') {
      res.send(`
        <html>
          <body>
            <h1>Bienvenido a SecureAdmin API</h1>
            <p>Accede a la <a href="/api/docs">documentación de Swagger</a>.</p>
          </body>
        </html>
      `);
    } else {
      next(); // Deja que otras rutas continúen normalmente
    }
  });

  // Servicio de Prisma
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Escuchar en el puerto 3000
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
