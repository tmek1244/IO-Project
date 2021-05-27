FROM python:3.8

# Non-root user for security purposes.
# https://github.com/hexops/dockerfile#run-as-a-non-root-user
#RUN addgroup -g 10001 -S nonroot \
#    && adduser -u 10000 -S -G nonroot -h /home/nonroot nonroot

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
WORKDIR /code

RUN apt-get update
#    && apt-get install postgresql-dev \
#    && apt-get install .build-deps gcc musl-dev python3-dev \
#    && apk add --no-cache tini \
#    && apt-get install bind-tools
COPY requirements.txt .
RUN pip install -r requirements.txt
#    && apk del .build-deps

COPY /backend IOProject /users ./
#COPY  /IOProject
#COPY /users

# Tini allows us to avoid several Docker edge cases,
# see https://github.com/krallin/tini.
#ENTRYPOINT ["/sbin/tini", "--", "python"]
#CMD ["manage.py", "makemigrations", "backend"]
#CMD ["manage.py", "makemigrations", "users"]
#CMD ["manage.py", "makemigrations"]
#CMD ["manage.py", "migrate"]
# Use the non-root user to run our application
#USER nonroot
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]