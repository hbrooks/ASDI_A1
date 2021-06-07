
FROM python:3.9.5-slim

RUN apt-get update 

RUN mkdir /usr/src/vessel_tracker_service
WORKDIR /usr/src/vessel_tracker_service

RUN pip install --upgrade pip
COPY ./* /usr/src/vessel_tracker_service/
RUN pip3 install -r /usr/src/vessel_tracker_service/requirements.txt

WORKDIR /usr/src/vessel_tracker_service

ENTRYPOINT [ "python" ]

CMD [ "app.py" ]