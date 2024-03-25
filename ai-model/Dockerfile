FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /ai-model

# Copy the Python requirements file
COPY requirements.txt requirements.txt

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY src/ src/
COPY utils/ utils/
COPY app.py app.py
COPY .env.production .env

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Run the Python application
CMD ["python", "app.py"]
