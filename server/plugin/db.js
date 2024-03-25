'use strict';

import fp from 'fastify-plugin';
import FastifyMongo from '@fastify/mongodb';

const mongodb = async (fastify) => {
    try {
        await fastify.register(FastifyMongo, {
            forceClose: true,
            url: process.env.MONGO_DB_URI,
        });

        fastify.log.info(`MongoDB connection established at ${process.env.MONGO_DB_URI}`);
    } catch (error) {
        fastify.log.error(`MongoDB connection error: ${error.message}`);
        throw error(`MongoDB connection error: ${error.message}`);
    }
}

export default fp(mongodb);
