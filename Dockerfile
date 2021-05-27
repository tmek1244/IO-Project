FROM python:3.8-alpine

# Non-root user for security purposes.
# https://github.com/hexops/dockerfile#run-as-a-non-root-user
#RUN addgroup -g 10001 -S nonroot \
#    && adduser -u 10000 -S -G nonroot -h /home/nonroot nonroot

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

# Tini allows us to avoid several Docker edge cases,
# see https://github.com/krallin/tini.
#ENTRYPOINT ["/sbin/tini", "--", "python"]
#CMD ["manage.py", "makemigrations", "backend"]
#CMD ["manage.py", "makemigrations", "users"]
#CMD ["manage.py", "makemigrations"]
#CMD ["manage.py", "migrate"]
# Use the non-root user to run our application
#USER nonroot
RUN adduser -D myuser
USER myuser
CMD gunicorn IOProject.wsgi:application --bind 0.0.0.0:$PORT
