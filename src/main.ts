import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const allowCorsOnDevEnv = process.env.ENV_NAME !== 'prod';
    const app = await NestFactory.create(AppModule, {
        cors: allowCorsOnDevEnv,
    });

    const servicePort = 3050;

    app.enableShutdownHooks();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }));

    await app.listen(servicePort);
}

bootstrap();
