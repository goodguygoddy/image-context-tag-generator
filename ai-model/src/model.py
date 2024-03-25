import io
import requests
import torch
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.tag import pos_tag
from bson import ObjectId
from utils.logger import setup_logger


# Set up logger
log = setup_logger(__name__)

# NLTK setup
nltk.download('punkt', quiet=True)
nltk.download('averaged_perceptron_tagger', quiet=True)
nltk.download('stopwords', quiet=True)

# BLIP model setup (done once to optimize resources)
device = torch.device("cpu")
model_name = 'Salesforce/blip-image-captioning-large'
processor = BlipProcessor.from_pretrained(model_name)
model = BlipForConditionalGeneration.from_pretrained(model_name).to(device)

def extract_tags(caption):
    """Extract relevant tags from captions."""
    sentences = sent_tokenize(caption)
    tags = set()
    for sentence in sentences:
        words = word_tokenize(sentence)
        tagged_words = pos_tag(words)
        for word, tag in tagged_words:
            if tag in ['NN', 'NNS'] and word.lower() not in stopwords.words('english'):
                tags.add(word.lower())
    return list(tags)

def process_image(image_id, image_url, collection):
    """Process each image: fetch, caption, tag, and update MongoDB."""
    try:
        response = requests.get(image_url.strip().strip('"'))
        response.raise_for_status()
        image_bytes = io.BytesIO(response.content)
        image = Image.open(image_bytes).convert("RGB")

        pixel_values = processor(images=image, return_tensors="pt").pixel_values.to(device)
        output_ids = model.generate(pixel_values, max_length=128, num_beams=4, return_dict_in_generate=True).sequences
        caption = processor.decode(output_ids[0], skip_special_tokens=True)

        tags = extract_tags(caption)

        log.info(f"Context: {caption}, Tags: {tags}")
        result = collection.update_one({'_id': ObjectId(image_id)}, {'$set': {'context': caption, 'tags': tags}}, upsert=True)
        log.info(f"MongoDB Update - Matched: {result.matched_count}, Modified: {result.modified_count}, Upserted ID: {result.upserted_id}")
    except Exception as e:
        log.error(f"Error processing image ID {image_id}: {e}")

