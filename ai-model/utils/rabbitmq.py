import pika
from utils.logger import setup_logger

log = setup_logger(__name__)

def setup_rabbitmq(rabbitmq_url, rabbitmq_queue_name, on_message_callback):
    try:
        connection = pika.BlockingConnection(pika.URLParameters(rabbitmq_url))
        channel = connection.channel()
        channel.queue_declare(queue=rabbitmq_queue_name, durable=True)
        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(queue=rabbitmq_queue_name, on_message_callback=on_message_callback)
        log.info('RabbitMQ - Waiting for messages. To exit press CTRL+C')
        channel.start_consuming()
    except Exception as e:
        log.error(f'Error occurred: {e}')
        log.info('Initiating graceful shutdown due to error.')
    finally:
        if connection and connection.is_open:
            connection.close()
            log.info('RabbitMQ connection closed')
