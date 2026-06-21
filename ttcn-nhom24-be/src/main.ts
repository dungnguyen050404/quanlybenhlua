import { BadRequestException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { useContainer } from 'class-validator';
import { AllExceptionFilter } from 'common/filters';
import { ResponseInterceptor } from 'common/interceptors';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // ✅ Đăng ký Interceptor toàn cục
  app.useGlobalInterceptors(new ResponseInterceptor());

  // ✅ Đăng ký Exception Filter toàn cục
  app.useGlobalFilters(new AllExceptionFilter());

  const OTHER_URLS_CLIENT = process.env.OTHER_URLS_CLIENT ? JSON.parse(process.env.OTHER_URLS_CLIENT) : [];
  const APP_URL_CLIENT = process.env.APP_URL_CLIENT;
  const node_env = process.env.NODE_ENV || 'development';
  const host = process.env.HOST || 'localhost';
  const port = parseInt(process.env.PORT, 10) || 2002;

  // Thêm middleware cookie-parser
  app.use(cookieParser());
  app.enableCors({
    origin: [APP_URL_CLIENT, ...OTHER_URLS_CLIENT],
    credentials: true,
  });

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API for user management')
    .setVersion('1.0')
    .addTag('Auth')
    .addBearerAuth()
    .build();

  // Tạo tài liệu Swagger từ cấu hình trên
  const document = SwaggerModule.createDocument(app, config);

  // Thiết lập Swagger UI với đường dẫn /api
  SwaggerModule.setup('api', app, document);

  // Bật ValidationPipe để kích hoạt xác thực cho các DTO
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors) => {
        // Create a flattened error object with clear paths to each error
        const formattedErrors = {};

        const formatErrors = (errors, parentKey = '') => {
          errors.forEach((error) => {
            // Handle case where error has direct constraints
            if (error.constraints) {
              const message = Object.values(error.constraints)[0]; // Get first error message
              const key = parentKey ? `${parentKey}.${error.property}` : error.property;
              formattedErrors[key] = message;
            }

            // If error has children, process them recursively
            if (error.children && error.children.length > 0) {
              const newParentKey = parentKey ? `${parentKey}.${error.property}` : error.property;
              formatErrors(error.children, newParentKey);
            }
          });
        };

        formatErrors(validationErrors);

        return new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          message: 'Validation failed',
          errors: formattedErrors,
        });
      },
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );

  await app.listen(port, () =>
    console.log(`Server is running on http://${host}:${port} in ${node_env} mode.`),
  );
}
bootstrap();
