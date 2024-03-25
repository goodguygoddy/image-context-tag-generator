'use strict';

import fp from 'fastify-plugin';
import multipart from '@fastify/multipart';

const multipartPlugin = async (fastify) => {
    await fastify.register(multipart, {
        limits: {
          fileSize: 10 * 1024 * 1024 // 10MB in bytes
        }
    });
}

export default fp(multipartPlugin);