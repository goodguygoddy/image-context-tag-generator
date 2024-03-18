import Fastify from 'fastify';
import autoload from '@fastify/autoload';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import FastifyMongo from '@fastify/mongodb';
import { S3Client } from '@aws-sdk/client-s3'

config();

const s3Config = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

// Create an S3 client instance
const s3Client = new S3Client(s3Config);

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
      }
    }
  }
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


await fastify.register(cors); // CORS plugin
await fastify.decorate('s3Client', s3Client);
await fastify.register(multipart);

await fastify.register(FastifyMongo, {
  url: `mongodb://${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`
});

// Auto-load routes
await fastify.register(autoload, {
  dir: join(__dirname, 'routes'),
  forceESM: true,
});

const start = async () => {
  try {
    await fastify.listen({ port: process.env.SERVER_PORT, host: process.env.SERVER_HOST });
    console.log(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

