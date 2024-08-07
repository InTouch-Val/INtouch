#!/usr/bin/env sh

python manage.py makemigrations
python manage.py migrate --noinput

DJANGO_SUPERUSER_USERNAME="admin" \
  DJANGO_SUPERUSER_PASSWORD="admin" \
  DJANGO_SUPERUSER_EMAIL="admin@example.com" \
  python manage.py createsuperuser --noinput

python manage.py collectstatic --noinput

gunicorn -b 0.0.0.0:8000 INtouch.wsgi --daemon
python manage.py rundramatiq
