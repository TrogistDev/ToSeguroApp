// apps/api/src/infrastructure/external-services/googleMapsService.ts
export class GoogleMapsService {
  private apiKey: string;

  constructor() {
    // TODO: [REQUERIMIENTO] Obtener la API KEY de las variables de entorno
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY || ''; 
  }

  async getPlaceDetails(placeId: string) {
    // Lógica para llamar a la API de Google Places
    // TODO: Implementar fetch con la URL de Google Maps API usando this.apiKey
  }
}

// apps/api/src/infrastructure/external-services/emailService.ts
import nodemailer from 'nodemailer';

export class EmailService {
  async sendPasswordReset(to: string, resetLink: string) {
    // TODO: [REQUERIMIENTO] Configurar tu transporte SMTP (SendGrid, Mailtrap o Gmail)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"Accident System" <noreply@system.com>',
      to: to,
      subject: "Cambio de contraseña obligatorio",
      html: `<p>Haz clic aquí para continuar: <a href="${resetLink}">Reset Password</a></p>`,
    });
  }
}
