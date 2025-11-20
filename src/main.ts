import { NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from './filter/all-exceptions.filter';
import { AppModule } from './module/app/app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
