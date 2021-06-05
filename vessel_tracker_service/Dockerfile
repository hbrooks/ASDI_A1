FROM python:3.9.5-slim

# RUN apt-get update \
#     && apt-get -y install libpq-dev gcc

COPY ./requirements.txt ./requirements.txt
RUN pip install -r ./requirements.txt

COPY lambda_handler.py   ./lambda_handler
COPY src/   ./

ENTRYPOINT [ "/usr/local/bin/python", "-m", "awslambdaric" ]
CMD [ "lambda_handler.handler" ]
