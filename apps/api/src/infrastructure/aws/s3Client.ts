import { S3Client } from "@aws-sdk/client-s3";

const isDev = process.env.NODE_ENV === "development";

export const s3Client = new S3Client({
  region: process.env.AWS_REGION || "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "mock_key",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "mock_secret",
  },
  // ✅ ADICIONE ISSO PARA FORÇAR O LOCALHOST EM DEV
  ...(isDev && {
    endpoint: "http://localhost:3000", // Porta padrão do LocalStack ou a porta do seu MinIO local
    forcePathStyle: true, // Necessário para o local não quebrar com subdomínios virtuais do S3
  }),
});