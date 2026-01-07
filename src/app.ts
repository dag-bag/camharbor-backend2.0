import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
// import mongoSanitize from 'express-mongo-sanitize';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import cityRoutes from './routes/cityRoutes';
import uploadRoutes from './routes/uploadRoutes';
import blogRoutes from './routes/blogRoutes';

import brandRoutes from './routes/brandRoutes';
import zoneRoutes from './routes/zoneRoutes';

const app = express();

app.use(express.json());
app.use(compression()); // Compress all responses
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for Swagger UI to work properly in dev
}));
// app.use(mongoSanitize()); // Removed due to Express 5 incompatibility causing "Cannot set property query" error
app.use(morgan('dev'));

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/blogs', blogRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/zones', zoneRoutes);

import localityRoutes from './routes/localityRoutes';
import serviceRoutes from './routes/serviceRoutes';
import productRoutes from './routes/productRoutes';
import riskRoutes from './routes/riskRoutes';

app.use('/api/localities', localityRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/risks', riskRoutes);

app.get('/', (req, res) => {
  res.send('CamHarbor API is running...');
});

// Routes loaded: Cities, Upload, Blogs

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[Error] ${err.message}`);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Server Error' : err.message
  });
});

export default app;
