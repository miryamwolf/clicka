import swaggerUi, { JsonObject } from 'swagger-ui-express';
import yaml from 'js-yaml';
import path from 'path';
import fs from 'node:fs';

import { Express } from 'express';

export function setupSwagger(app: Express) {
const swaggerDocument = yaml.load(
  fs.readFileSync(path.resolve(__dirname, './swagger.yaml'), 'utf8')
) as JsonObject;
   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      withCredentials: true,
      persistAuthorization: true, // This allows the UI to remember the auth token
    },
  }));
} 
