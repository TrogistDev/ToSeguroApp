import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();

export class EmailService {
  private readonly transporter: nodemailer.Transporter;
  private readonly fromEmail: string;

  constructor() {
    const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
    const port = Number(process.env.EMAIL_PORT) || 465;
    const user = process.env.EMAIL_USER!;
    const pass = process.env.EMAIL_PASS!;
    const from = process.env.EMAIL_FROM!;

    if (!user || !pass || !from) {
      throw new Error("❌ EMAIL_USER, EMAIL_PASS e EMAIL_FROM são obrigatórios.");
    }

    this.fromEmail = from;
    
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: true },
    });
  }

  async sendWelcomeEmail(to: string, tempPassword: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: { address: this.fromEmail, name: "Accident System" },
        to,
        subject: "Sua senha temporária — ToSeguro",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
            <h2>🔐 Bem-vindo ao ToSeguro!</h2>
            <p>Sua conta foi criada com sucesso.</p>
            <div style="background:#f1f5f9;padding:16px;border-radius:8px;margin:16px 0;">
              <strong>Sua senha temporária é:</strong><br/>
              <code style="display:block;font-size:20px;color:#dc2626;background:white;padding:12px;">
                ${tempPassword}
              </code>
            </div>
            <p>Use essa senha para seu primeiro login. Depois, você pode alterá-la.</p>
          </div>
        `,
      });
      console.log(`📧 Email enviado com sucesso para ${to}`);
      return true;
    } catch (err) {
      console.error("🚨 Erro ao enviar email:", err);
      return false;
    }
  }

  // Opcional: método futuro para reset
  async sendPasswordResetEmail(to: string, resetToken: string): Promise<boolean> {
    const url = `${process.env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(resetToken)}`;
    try {
      await this.transporter.sendMail({
        from: { address: this.fromEmail, name: "Accident System" },
        to,
        subject: "Redefinição de Senha",
        html: `<p>Clique para redefinir: <a href="${url}">${url}</a></p>`,
      });
      return true;
    } catch (err) {
      console.error("📧 Erro no reset:", err);
      return false;
    }
  }
}
