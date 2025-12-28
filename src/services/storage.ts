import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Express } from 'express';
import multer from 'multer';
import path from 'path';

/**
 * Backblaze B2 S3 client (HARD-CODED for testing)
 */
const endpoint = 's3.eu-central-003.backblazeb2.com';
const region = 'eu-central-003';
const bucket = 'camharbor';

const s3Client = new S3Client({
  endpoint: `https://${endpoint}`,
  region,
  forcePathStyle: true, // 🔥 REQUIRED for Backblaze B2
  credentials: {
    accessKeyId: '0033c0e9d4f16390000000001',
    secretAccessKey: 'K003V1ePrC9cbmZYmBE7E0orLwkXdq0',
  },
});

/**
 * Upload file to Backblaze B2
 */
export const uploadFile = async (
  file: Express.Multer.File
): Promise<string> => {
  const ext = path.extname(file.originalname);

  const fileName = `camharbor-${Date.now()}-${Math.round(
    Math.random() * 1000
  )}${ext}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    await s3Client.send(command);

    // Public URL (bucket must be public)
    return `https://${endpoint}/${bucket}/${fileName}`;
  } catch (error) {
    console.error('Error uploading to Backblaze B2:', error);
    throw new Error('Failed to upload file');
  }
};

/**
 * Multer config (memory storage)
 */
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});
