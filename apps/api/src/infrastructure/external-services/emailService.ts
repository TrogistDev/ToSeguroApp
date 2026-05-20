// apps/api/src/infrastructure/services/EmailService.ts
import nodemailer from 'nodemailer';
import { MailtrapTransport } from 'mailtrap';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const token = process.env.EMAIL_PASS; // Usamos o seu token: ba20cc09bbd038387ff3c

    if (!token) {
      throw new Error("❌ EmailService: Token de autenticação do Mailtrap (EMAIL_PASS) não configurado.");
    }

    // Inicialização rígida utilizando o transporte oficial via SDK
    this.transporter = nodemailer.createTransport(
      MailtrapTransport({
        token: token,
      })
    );
  }

  async sendResetPasswordEmail(to: string, resetToken: string): Promise<boolean> {
    const url = `${process.env.FRONTEND_URL}/reset-password#token=${resetToken}`;

    try {
      await this.transporter.sendMail({
        from: { address: "no-reply@demomailtrap.co", name: "Accident System" },
        to: [to],
        subject: "Recuperação de Senha - Urgente",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #334155;">
            <h1 style="color: #2563eb;">Redefinição de Senha</h1>
            <p>Você solicitou a alteração de sua senha no Accident System. Clique no link abaixo para prosseguir:</p>
            <p style="margin: 24px 0;">
              <a href="${url}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Resetar minha senha
              </a>
            </p>
            <p style="font-size: 12px; color: #64748b;">Se você não solicitou isso, ignore este e-mail com segurança.</p>
          </div>
        `,
      });
      return true;
    } catch (error) {
      console.error(`🚨 Falha ao enviar e-mail de reset para ${to}:`, error);
      return false;
    }
  }

  async sendWelcomeEmail(to: string, tempPassword: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: { address: "no-reply@demomailtrap.co", name: "Accident System" },
        to: [to],
        subject: "Bem-vindo ao Sistema de Reportes",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #334155;">
            <h1 style="color: #2563eb;">Bem-vindo!</h1>
            <p>Sua conta foi criada com sucesso na plataforma de auditoria.</p>
            <p style="background-color: #f1f5f9; padding: 16px; border-radius: 6px; border-left: 4px solid #2563eb;">
              <strong>Sua senha temporária é:</strong> <code style="font-size: 16px; color: #0f172a;">${tempPassword}</code>
            </p>
            <p>Por favor, altere sua senha imediatamente no seu primeiro acesso.</p>
          </div>
        `,
      });
      return true;
    } catch (error) {
      console.error(`🚨 Falha ao enviar e-mail de boas-vindas para ${to}:`, error);
      return false;
    }
  }
}