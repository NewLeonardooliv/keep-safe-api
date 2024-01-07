import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
// import { ResponseA256GCMInterceptor } from './interceptors/responseA256GCM.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // app.useGlobalInterceptors(new ResponseA256GCMInterceptor());

  await app.listen(3000);
}
bootstrap();
