'use strict';

import fp from 'fastify-plugin';
import { S3Client } from '@aws-sdk/client-s3';

const s3Config = {
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
};

const s3 = (fastify, opts, done) => {
    fastify.log.info('Initializing AWS S3 Client with provided configuration...');
    const s3Client = new S3Client(s3Config);

    fastify.decorate('s3', s3Client);
    fastify.log.info('AWS S3 Client successfully initialized');
    done();
}

export default fp(s3);