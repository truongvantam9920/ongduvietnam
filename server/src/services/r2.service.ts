import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import path from 'node:path';
import fs from 'node:fs';
import { config } from '../config.js';

let s3Client: S3Client | null = null;

if (config.r2.isConfigured) {
  s3Client = new S3Client({
    region: 'auto',
    endpoint: config.r2.endpoint,
    credentials: {
      accessKeyId: config.r2.accessKeyId,
      secretAccessKey: config.r2.secretAccessKey,
    },
  });
  console.log(`[Cloudflare R2] Connected to bucket: ${config.r2.bucketName}`);
} else {
  console.log('[Cloudflare R2] Not configured in .env. Falling back to local storage.');
}

export async function uploadImageFile(
  buffer: Buffer,
  originalFilename: string,
  mimetype: string
): Promise<string> {
  const ext = path.extname(originalFilename).toLowerCase();
  const baseName = path.basename(originalFilename, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 30);
  const uniqueKey = `products/ongdu-${baseName}-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;

  // If Cloudflare R2 is configured, upload to R2
  if (s3Client && config.r2.isConfigured) {
    const command = new PutObjectCommand({
      Bucket: config.r2.bucketName,
      Key: uniqueKey,
      Body: buffer,
      ContentType: mimetype || 'image/jpeg',
      CacheControl: 'public, max-age=31536000, immutable',
    });

    await s3Client.send(command);

    if (config.r2.publicDomain) {
      const cleanDomain = config.r2.publicDomain.replace(/\/+$/, '');
      return `${cleanDomain}/${uniqueKey}`;
    }

    // Default R2 public endpoint
    return `${config.r2.endpoint}/${config.r2.bucketName}/${uniqueKey}`;
  }

  // Fallback to local storage if R2 is not configured
  const localFileName = `ongdu-${baseName}-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
  const localFilePath = path.join(config.uploadDir, localFileName);
  
  if (!fs.existsSync(config.uploadDir)) {
    fs.mkdirSync(config.uploadDir, { recursive: true });
  }

  fs.writeFileSync(localFilePath, buffer);
  return `/uploads/${localFileName}`;
}

export async function deleteImageFile(fileUrlOrKey: string): Promise<void> {
  if (s3Client && config.r2.isConfigured && fileUrlOrKey.includes('products/')) {
    try {
      const key = fileUrlOrKey.split('products/')[1];
      if (key) {
        await s3Client.send(new DeleteObjectCommand({
          Bucket: config.r2.bucketName,
          Key: `products/${key}`,
        }));
      }
    } catch (err) {
      console.error('[Cloudflare R2] Delete object error:', err);
    }
  } else if (fileUrlOrKey.startsWith('/uploads/')) {
    const filename = path.basename(fileUrlOrKey);
    const localPath = path.join(config.uploadDir, filename);
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
  }
}
