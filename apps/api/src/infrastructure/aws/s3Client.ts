import { S3Client } from "@aws-sdk/client-s3";

// Force a inicialização explícita com as credenciais que você já confirmou existirem
export const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});