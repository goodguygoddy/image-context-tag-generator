import io
import os
import pika
import requests
import torch
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.tag import pos_tag
from pymongo import MongoClient
from bson import ObjectId
import logging
from dotenv import load_dotenv
import json

# Load environment variables from .env file
load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Environment variables
RABBITMQ_URL = os.getenv('RABBITMQ_URL', 'localhost')
MONGODB_URL = os.getenv('MONGODB_URL', 'mongodb://localhost:27017/')
QUEUE_NAME = os.getenv('QUEUE_NAME', 'image_queue')
DB_NAME = os.getenv('DB_NAME', 'visualTechDB')
COLLECTION_NAME = os.getenv('COLLECTION_NAME', 'images')

# NLTK setup
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('stopwords')

# MongoDB setup
client = MongoClient(MONGODB_URL)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

def extract_tags(caption):
    sentences = sent_tokenize(caption)
    tags = set()
    for sentence in sentences:
        words = word_tokenize(sentence)
        tagged_words = pos_tag(words)
        for word, tag in tagged_words:
            if tag in ['NN', 'NNS'] and word.lower() not in stopwords.words('english'):
                tags.add(word.lower())
    return list(tags)

def process_image(image_id, image_url):
    try:
        response = requests.get(image_url.strip().strip('"'))
        response.raise_for_status()
        image_bytes = io.BytesIO(response.content)
        image = Image.open(image_bytes).convert("RGB")

        device = torch.device("cpu")
        model_name = 'Salesforce/blip-image-captioning-large'
        processor = BlipProcessor.from_pretrained(model_name)
        model = BlipForConditionalGeneration.from_pretrained(model_name).to(device)

        pixel_values = processor(images=image, return_tensors="pt").pixel_values.to(device)
        output_ids = model.generate(pixel_values, max_length=128, num_beams=4, return_dict_in_generate=True).sequences
        caption = processor.decode(output_ids[0], skip_special_tokens=True)

        tags = extract_tags(caption)

        logging.info(f"Context: {caption}")
        logging.info(f"Tags: {tags}")
        result = collection.update_one({'_id': ObjectId(image_id)}, {'$set': {'context': caption, 'tags': tags}}, upsert=True)
        logging.info(f"Matched: {result.matched_count}, Modified: {result.modified_count}, Upserted ID: {result.upserted_id}")
        logging.info(f"Updated MongoDB document for image ID: {image_id}")
    except Exception as e:
        logging.error(f"Error processing image ID {image_id}: {e}")

def on_message(ch, method, properties, body):
    message = body.decode('utf-8')
    message_dict = json.loads(message)
    id = message_dict.get("id")
    source = message_dict.get("source")
    logging.info(f"Received message with image ID: {id}")
    process_image(id, source)
    ch.basic_ack(delivery_tag=method.delivery_tag)

def setup_rabbitmq():
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_URL))
    channel = connection.channel()
    channel.queue_declare(queue=QUEUE_NAME)
    channel.basic_consume(queue=QUEUE_NAME, on_message_callback=on_message)
    logging.info('Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()

if __name__ == "__main__":
    setup_rabbitmq()
