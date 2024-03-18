FROM python:3.8-slim
RUN pip install torch transformers pillow pika pymongo requests
WORKDIR /ai-model
COPY requirements.txt .
COPY model.py .

RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 8000

CMD ["python", "model.py"]
