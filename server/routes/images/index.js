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
      try {
        const data = await request.file();
        const filename = data.filename;

        // Handle the file upload logic here
        console.log(filename);

        // Create params for S3 upload
        // const uploadParams = {
        //   Bucket: 'your-bucket-name', // Replace with your actual bucket name
        //   Key: filename, // File name you want to save as
        //   Body: data.file, // The actual file
        // };

        // Upload file to S3
        // s3.upload(uploadParams, (err, s3Response) => {
        //   if (err) {
        //     fastify.log.error(err);
        //     reply.code(500).send({ error: 'Failed to upload file' });
        //   } else {
        //     reply.code(200).send({ message: 'File uploaded successfully', data: s3Response });
        //   }
        // });

        reply.code(200).send("File received!");
      } catch (error) {
        // Log the error
        fastify.log.error(error);

        // Respond with an error message
        reply.code(500).send('Failed to upload file');
      }


    },
  });
};

export default images;
