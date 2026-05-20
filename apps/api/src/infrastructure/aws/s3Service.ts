// infrastructure/aws/s3Service.ts
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class S3Service {
  private s3Client: S3Client;

  constructor() {
    // Validação rígida de variáveis
    if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error("Variáveis de ambiente AWS faltando!");
    }

    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

// No S3Service.ts
async generatePresignedUrl(fileName: string, fileType: string) {
  const sanitizedFileName = fileName.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
  const key = `accidents/${Date.now()}-${sanitizedFileName}`;

  // FORÇAR O COMANDO PUT AQUI
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  
  return {
    uploadUrl,
    fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
  };
}
// Adicione isto dentro da classe S3Service
async getPresignedReadUrl(key: string) {
  // Limpeza de key para evitar erros de assinatura
  const cleanKey = key.startsWith('/') ? key.substring(1) : key;
  
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: cleanKey,
  });

  return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
}
}