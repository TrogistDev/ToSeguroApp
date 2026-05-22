import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    // Definimos o bucket sempre para o real que queres usar
    this.bucketName = process.env.AWS_BUCKET_NAME || "toseguro-storage-prod";

    // Validação rígida de segurança das credenciais
    if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error("[SECURITY CRITICAL] Variáveis de ambiente da AWS estão ausentes no ficheiro .env!");
    }

    // Instancia o cliente apontando SEMPRE para a AWS real
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async generatePresignedUrl(fileName: string, fileType: string) {
    const sanitizedFileName = fileName.replace(/[^a-z0-9.]/gi, "_").toLowerCase();
    const key = `accidents/${Date.now()}-${sanitizedFileName}`;

    // ✅ REMOVIDO O IF DEV. Agora gera para a AWS real em qualquer ambiente.
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: fileType,
    });

    // Gera a URL de upload assinada pela AWS
    const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    
    // Esta é a URL final que vai ser salva na tua Base de Dados (Postgres)
    const fileUrl = `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return { uploadUrl, fileUrl };
  }

  async getPresignedReadUrl(key: string) {
    const cleanKey = key.startsWith("/") ? key.substring(1) : key;
    
    // Se o link já for uma URL completa da AWS salva no banco, extraímos apenas a Key
    let finalKey = cleanKey;
    if (cleanKey.includes("amazonaws.com/")) {
      finalKey = cleanKey.split("amazonaws.com/")[1];
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: finalKey,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }
}