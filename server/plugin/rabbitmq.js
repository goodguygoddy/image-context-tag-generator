'use strict';

import fp from 'fastify-plugin';
import amqp from 'amqplib';

const rabbitMQPlugin = async (fastify, options) => {
    let connection, channel;
    let reconnectionAttempts = 0;
    const maxReconnectionAttempts = 10; // Maximum number of reconnection attempts

    const connect = async () => {
        if (reconnectionAttempts >= maxReconnectionAttempts) {
            fastify.log.error('Max reconnection attempts reached. Giving up on reconnecting to RabbitMQ.');
            return;
        }

        try {
            fastify.log.info('Connecting to RabbitMQ...');
            connection = await amqp.connect(options.url);
            channel = await connection.createChannel();
            fastify.log.info('RabbitMQ connection and channel established.');

            // Ensure the queue exists
            const queue = process.env.RABBITMQ_QUEUE;
            await channel.assertQueue(queue, { durable: true });
            fastify.log.info(`Queue '${queue}' is ensured.`);

            fastify.decorate('rabbitMQ', { channel });
            reconnectionAttempts = 0; // Reset reconnection attempts on successful connection

            // Handle connection close
            connection.on('close', () => {
                fastify.log.error('RabbitMQ connection closed. Attempting to reconnect...');
                reconnect();
            });

            // Handle connection errors
            connection.on('error', (err) => {
                fastify.log.error('RabbitMQ connection error:', err);
                reconnect();
            });

        } catch (err) {
            fastify.log.error('Failed to connect to RabbitMQ:', err);
            reconnect();
        }
    };

    // Reconnection logic with exponential backoff
    const reconnect = async () => {
        reconnectionAttempts++;
        const delay = Math.pow(2, reconnectionAttempts) * 1000; // Exponential backoff delay
        fastify.log.info(`Waiting ${delay}ms before reconnection attempt ${reconnectionAttempts}`);
        setTimeout(() => connect(), delay);
    };

    // Initial connection attempt
    await connect();

    // Graceful shutdown
    fastify.addHook('onClose', async () => {
        if (connection) {
            fastify.log.info('Closing RabbitMQ channel and connection...');
            await channel.close();
            await connection.close();
            fastify.log.info('RabbitMQ channel and connection closed.');
        }
    });
};

export default fp(rabbitMQPlugin);
