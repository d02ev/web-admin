import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly _mailerService: MailerService) {}

  public async sendPasswordResetLink(
    email: string,
    subject: string,
    link: string,
  ): Promise<any> {
    return await this._mailerService.sendMail({
      to: email,
      from: 'admin@example.com',
      subject: subject,
      html: link,
    });
  }
}
