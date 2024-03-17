'use strict';

const images = async (fastify, opts) => {
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      querystring: {
        search: { type: 'string' }
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              tags: {
                type: 'array',
                items: { type: 'string' }
              },
              source: { type: 'string' }
            }
          }
        }
      }
    },
    handler: async (request, reply) => {
      const db = fastify.mongo.db;
      const collection = db.collection('images');
      let query = {};

      if (request.query.search) {
        const searchRegex = new RegExp(request.query.search, 'i'); // 'i' for case-insensitive
        query = {
          $or: [
            { context: { $regex: searchRegex } },
            { tags: { $elemMatch: { $regex: searchRegex } } } // Use $elemMatch for array elements
          ]
        };
      }

      const images = await collection.find(query).toArray();
      reply.code(200).send(images);
    }
  });

  fastify.route({
    method: 'POST',
    url: '/upload',
    handler: async (request, reply) => {
      reply.code(200).send({ image: 'you have reached the upload API' });
    }
  });
};

export default images;
