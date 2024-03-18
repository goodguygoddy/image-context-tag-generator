'use strict';

import { Upload } from '@aws-sdk/lib-storage';

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
              context: { type: 'string' },
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
        const searchRegex = new RegExp(request.query.search, 'i');
        query = {
          $or: [
            { context: { $regex: searchRegex } },
            { tags: { $elemMatch: { $regex: searchRegex } } }
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
      const data = await request.file();
      const { file, mimetype } = data;

      const db = fastify.mongo.db;
      const collection = db.collection('images');
      const id = new fastify.mongo.ObjectId().toString();

      try {
        const uploadParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: id,
          Body: file,
          ContentType: mimetype,
        };

        const upload = new Upload({
          client: fastify.s3Client,
          params: uploadParams
        });

        const response = await upload.done();

        await collection.insertOne({
          _id: id,
          context: "",
          tags: [],
          source: response.Location
        });

        reply.code(201).send({ message: 'File uploaded successfully', response: response });
      } catch (error) {
        request.log.error(error);
        reply.code(500).send({ error: 'Failed to upload file' });
      }
    },
  });
};

export default images;
