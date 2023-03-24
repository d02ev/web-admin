import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as ExpressSession from 'express-session';
import * as Passport from 'passport';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = new ConfigService();

  app.use(
    ExpressSession({
      secret: configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 24 * 60 * 60 * 1000, secure: false, httpOnly: true },
    }),
  );
  app.use(Passport.initialize());
  app.use(Passport.session());

  app.setGlobalPrefix('api/v1');
  await app.listen(configService.get('PORT'));
}
bootstrap();
