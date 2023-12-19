FROM python:3.11-alpine

WORKDIR /app

COPY . .
COPY ./requirements.txt .

RUN pip install -r requirements.txt

ENV PYTHONUNBUFFERED=1

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]