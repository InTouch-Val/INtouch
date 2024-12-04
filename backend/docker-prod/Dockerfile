FROM python:3.9.10-slim

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt

ENV PYTHONUNBUFFERED=1

CMD ["sh", "run.sh"]
