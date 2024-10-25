import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { TransformResponseInterceptor } from '@/common/interceptors/transform-response.interceptor';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Tạo instance của Logger
  const logger = new Logger('Application');

  // Lấy ConfigService
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // Cấu hình ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Chuyển đổi dữ liệu vào thành các đối tượng DTO
      whitelist: true, // Loại bỏ các thuộc tính không có trong DTO
      forbidNonWhitelisted: true, // Cấm các thuộc tính không có trong DTO
      validateCustomDecorators: true, // Cho phép các decorator tùy chỉnh
    }),
  );

  // Cấu hình swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The Movies API description')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
      description: 'Enter your Bearer token',
    })
    .addSecurityRequirements('bearer')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  // Tạo tài liệu Swagger
  const document = SwaggerModule.createDocument(app, config, options);

  // Cấu hình tùy chỉnh Swagger để ẩn schema
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      defaultModelsExpandDepth: -1, // Ẩn phần schema
    },
  };

  SwaggerModule.setup('swagger', app, document, customOptions);

  const port = configService.get<number>('PORT', 6677);
  await app.listen(port);

  logger.log(`Application is running on: http://127.0.0.1:${port}/`);
}

bootstrap();
