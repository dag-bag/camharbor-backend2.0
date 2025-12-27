import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Express } from 'express';
import multer from 'multer';
import path from 'path';

export const uploadFile = async (file: Express.Multer.File): Promise<string> => {
  // Validate required environment variables
  const requiredEnvVars = ['B2_ENDPOINT', 'B2_REGION', 'B2_APPLICATION_KEY_ID', 'B2_APPLICATION_KEY', 'B2_BUCKET_NAME'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error(`❌ Missing Backblaze B2 environment variables: ${missingVars.join(', ')}`);
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}. Please add them to your .env file.`);
  }

  // Configure S3 Client for Backblaze B2 lazily
  const endpoint = (process.env.B2_ENDPOINT || '').trim();
  const bucket = (process.env.B2_BUCKET_NAME || '').trim();
  
  const s3Client = new S3Client({
    endpoint: endpoint.startsWith('http') ? endpoint : `https://${endpoint}`,
    region: (process.env.B2_REGION || 'eu-central-003').trim(),
    credentials: {
      accessKeyId: (process.env.B2_APPLICATION_KEY_ID || '').trim(),
      secretAccessKey: (process.env.B2_APPLICATION_KEY || '').trim(),
    },
  });

  const fileExtension = path.extname(file.originalname);
  const fileName = `camharbor-${Date.now()}-${Math.round(Math.random() * 1000)}${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    await s3Client.send(command);
    
    // Construct the public URL for Backblaze B2
    // Backblaze B2 S3-compatible endpoint format: https://<endpoint>/<bucket-name>/<file-key>
    const publicUrl = `https://${endpoint}/${bucket}/${fileName}`;
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading file to Backblaze B2:', error);
    throw new Error('Failed to upload file');
  }
};

// Multer configuration for memory storage
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit (increased from 5MB)
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});
