FROM python:3.8-alpine

# Non-root user for security purposes.
# https://github.com/hexops/dockerfile#run-as-a-non-root-user
RUN addgroup -g 10001 -S nonroot \
    && adduser -u 10000 -S -G nonroot -h /home/nonroot nonroot

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
WORKDIR /code

RUN apk update \
    && apk add postgresql-dev \
    && apk add --no-cache --virtual .build-deps gcc musl-dev python3-dev \
    && apk add --no-cache tini \
    && apk add --no-cache bind-tools
COPY requirements.txt .
RUN pip install -r requirements.txt \
    && apk del .build-deps

COPY . .

# Tini allows us to avoid several Docker edge cases,
# see https://github.com/krallin/tini.
ENTRYPOINT ["/sbin/tini", "--", "python"]

# Use the non-root user to run our application
USER nonroot
CMD ["manage.py", "runserver", "0.0.0.0:8000"]