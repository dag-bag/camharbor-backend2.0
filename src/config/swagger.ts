import swaggerJsdoc from 'swagger-jsdoc';
import mongooseToSwagger from 'mongoose-to-swagger';
import City from '../models/City';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CamHarbor API',
      version: '1.0.0',
      description: 'API Documentation for CamHarbor Backend',
      contact: {
        name: 'CamHarbor Support',
        url: 'https://camharbor.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development Server',
      },
    ],
    components: {
      schemas: {
        City: mongooseToSwagger(City),
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
