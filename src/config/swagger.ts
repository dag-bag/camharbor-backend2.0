import swaggerJsdoc from 'swagger-jsdoc';

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
        City: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            slug: { type: 'string' },
            display_name: { type: 'string' },
            state: { type: 'string' },
            country: { type: 'string' },
            is_active: { type: 'boolean' },
            geo: {
              type: 'object',
              properties: {
                coordinates: {
                  type: 'object',
                  properties: {
                    lat: { type: 'number' },
                    lng: { type: 'number' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
