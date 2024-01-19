import './prototype';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExecptionFilter } from './http-execption/http-execption.filter';
import { TransformInterceptor } from './transform/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'error', 'warn'],
  });

  app.useGlobalFilters(new HttpExecptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));

  await app.listen(3000);
}
bootstrap().catch((e) => {
  console.log(e);
});
