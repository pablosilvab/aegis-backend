import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

function getCorsOrigins(): string[] {
  const origins: string[] = [];
  
  if (process.env.NODE_ENV !== 'production') {
    origins.push('http://localhost:3001');
    origins.push('http://localhost:3000');
  }
  
  if (process.env.FRONTEND_URL) {
    origins.push(process.env.FRONTEND_URL);
  }
  
  if (process.env.ALLOWED_ORIGINS) {
    const additionalOrigins = process.env.ALLOWED_ORIGINS.split(',').map(
      (url) => url.trim()
    );
    origins.push(...additionalOrigins);
  }
  
  return [...new Set(origins)];
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const allowedOrigins = getCorsOrigins();
  
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configurar guard global de JWT
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`Aegis backend running on: http://localhost:${port}/api`);
  console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`);
}

bootstrap();