import json
from dotenv import load_dotenv
import os
from utils.rabbitmq import setup_rabbitmq
from utils.mongodb import get_mongodb_collection
from utils.logger import setup_logger
from dotenv import load_dotenv
from src.model import process_image


# Load environment variables and set up logger
load_dotenv()
log = setup_logger(__name__)

# Environment variables
RABBITMQ_URL = os.getenv('RABBITMQ_URL')
RABBITMQ_QUEUE_NAME = os.getenv('RABBITMQ_QUEUE_NAME')
MONGO_DB_URL = os.getenv('MONGO_DB_URL')
MONGO_DB_NAME = os.getenv('MONGO_DB_NAME')
MONGO_DB_COLLECTION = os.getenv('MONGO_DB_COLLECTION')

def on_message(ch, method, properties, body, collection):
    """Callback for when a message is received from RabbitMQ."""
    message = body.decode('utf-8')
    message_dict = json.loads(message)
    image_id = message_dict.get("id")
    source = message_dict.get("source")

    log.info(f"Received message with image ID: {image_id}")
    process_image(image_id, source, collection)
    ch.basic_ack(delivery_tag=method.delivery_tag)

if __name__ == "__main__":
    try:
        collection = get_mongodb_collection(MONGO_DB_URL, MONGO_DB_NAME, MONGO_DB_COLLECTION)
        setup_rabbitmq(RABBITMQ_URL, RABBITMQ_QUEUE_NAME, lambda ch, method, properties, body: on_message(ch, method, properties, body, collection))
    except KeyboardInterrupt:
        log.info('Application terminated by user. Graceful shutdown complete.')
    except Exception as e:
        log.error(f'Unexpected error occurred: {e}')
        log.info('Initiating graceful shutdown due to unexpected error.')
        # Here you can also perform any necessary cleanup before exiting
    finally:
        # This block will execute whether an exception occurred or not, and can be used for cleanup that should happen in either case
        log.info('Cleanup completed. Exiting application.')
