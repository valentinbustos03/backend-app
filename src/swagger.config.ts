import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API del sistema de restaurante',
      version: '1.0.14',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local de desarrollo',
      },
    ],
  },
  //apis: ['./src/**/*.ts'],
  apis: ['./src/**/*.yml'],

};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
