FROM python:3.8-alpine

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
WORKDIR /code

RUN apk update \
    && apk add postgresql-dev \
    && apk add --no-cache --virtual .build-deps gcc musl-dev python3-dev \
    && apk add --no-cache bind-tools
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY /backend backend
COPY /IOProject IOProject
COPY /users users
COPY manage.py manage.py

RUN adduser -D myuser
RUN python manage.py collectstatic --noinput
USER myuser
CMD gunicorn IOProject.wsgi:application --bind 0.0.0.0:$PORT
