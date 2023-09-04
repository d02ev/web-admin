import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards';
import { TransactionModule } from './transaction/transaction.module';
import * as DotEnv from 'dotenv';
import { MailerModule } from '@nestjs-modules/mailer';
import { TokenModule } from './token/token.module';
import { EmailModule } from './email/email.module';

DotEnv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URI),
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        tls: {
          ciphers: process.env.SMTP_CIPHERS,
        },
        secure: false,
        auth: {
          user: process.env.SMTP_EMAIL_ID,
          pass: process.env.SMTP_EMAIL_PASS,
        },
      },
    }),
    UserModule,
    AuthModule,
    BlogModule,
    TransactionModule,
    TokenModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [AppService],
})
export class AppModule {}
