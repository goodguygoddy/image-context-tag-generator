import torch
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.tag import pos_tag

nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('stopwords')

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

def caption_image(image_path, model_name='Salesforce/blip-image-captioning-large'):
    device = torch.device("cpu")

    processor = BlipProcessor.from_pretrained(model_name)
    model = BlipForConditionalGeneration.from_pretrained(model_name).to(device)

    image = Image.open(image_path).convert("RGB")
    pixel_values = processor(images=image, return_tensors="pt").pixel_values.to(device)

    output_ids = model.generate(pixel_values, max_length=128, num_beams=4, return_dict_in_generate=True).sequences

    caption = processor.decode(output_ids[0], skip_special_tokens=True)
    print(f"Caption: {caption}")

    tags = extract_tags(caption)
    print(f"Tags: {tags}")

caption_image('/home/goddy/projects/VisualTech/images/image.jpg')
