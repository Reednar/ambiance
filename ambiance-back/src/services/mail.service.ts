import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;
  private frontendUrl: string;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });

    this.frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:4200';
  }

  async sendConfirmationEmail(to: string, token: string) {
    const confirmationUrl = `${this.frontendUrl}?token=${token}`;

    const mailOptions = {
      from: `"Ambiance: " <${this.configService.get<string>('MAIL_USER')}>`,
      to,
      subject: 'Confirme ton compte',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; border-radius: 8px; border: 1px solid #ddd;">
        <h2 style="color: #333;">Bienvenue chez Ambiance !</h2>
        <p style="font-size: 16px; color: #555;">
          Merci pour ton inscription. Pour finaliser la création de ton compte, merci de confirmer ton adresse email en cliquant sur le bouton ci-dessous :
        </p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${confirmationUrl}" style="background-color: #007bff; color: #fff; padding: 14px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Confirmer mon compte
          </a>
        </p>
        <p style="font-size: 14px; color: #999;">
          Si tu n’as pas créé de compte, ignore simplement ce message.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="font-size: 12px; color: #aaa; text-align: center;">
          © 2025 Ton App - Tous droits réservés.
        </p>
      </div>
    `,
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendResetPasswordEmail(to: string, token: string) {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${token}`;

    const mailOptions = {
      from: `"Ambiance: " <${this.configService.get<string>('MAIL_USER')}>`,
      to,
      subject: 'Réinitialisation de ton mot de passe',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; border-radius: 8px; border: 1px solid #ddd;">
        <h2 style="color: #333;">Réinitialisation de mot de passe</h2>
        <p style="font-size: 16px; color: #555;">
          Tu as demandé à réinitialiser ton mot de passe. Clique sur le bouton ci-dessous pour définir un nouveau mot de passe :
        </p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #007bff; color: #fff; padding: 14px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Réinitialiser mon mot de passe
          </a>
        </p>
        <p style="font-size: 14px; color: #999;">
          Si tu n’as pas demandé cette réinitialisation, ignore simplement ce message.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="font-size: 12px; color: #aaa; text-align: center;">
          © 2025 Ton App - Tous droits réservés.
        </p>
      </div>
    `,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
