import Fastify from 'fastify';
import autoload from '@fastify/autoload';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from '@fastify/cors';
// import config from './config/default.js';
import mongodb from './plugin/db.js';
import rabbitmq from './plugin/rabbitmq.js';
import multipart from './plugin/multipart.js';
import s3 from './plugin/s3.js';



const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  }
});

// Plugins
await fastify.register(cors);
await fastify.register(mongodb);
await fastify.register(multipart);
await fastify.register(s3);
await fastify.register(rabbitmq, {
  url: process.env.RABBITMQ_URI
});


// AutoLoad Routes
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
await fastify.register(autoload, {
  dir: join(__dirname, 'routes'),
  forceESM: true,
});


// Start Fastify Server
try {
  fastify.listen({ port: process.env.SERVER_PORT, host: process.env.SERVER_HOST });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}



