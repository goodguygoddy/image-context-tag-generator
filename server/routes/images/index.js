'use strict';

import { getImagesSchema } from '../../models/images.model.js';
import { getImagesController, uploadImageContoller } from '../../controller/images.contoller.js';

const images = async (fastify, opts) => {
  fastify.route({
    method: 'GET',
    url: '/',
    schema: getImagesSchema,
    handler: (request, reply) => getImagesController(fastify, request, reply)
  });

  fastify.route({
    method: 'POST',
    url: '/upload',
    handler: (request, reply) => uploadImageContoller(fastify, request, reply)
  });
};

export default images;
