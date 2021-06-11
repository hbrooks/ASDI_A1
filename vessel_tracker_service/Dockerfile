FROM python:3.9

WORKDIR /usr/src

RUN mkdir /usr/src/vessel_tracker_service
COPY ./requirements.txt /usr/src/vessel_tracker_service/requirements.txt
RUN pip3 install -r /usr/src/vessel_tracker_service/requirements.txt

COPY ./main.py /usr/src/vessel_tracker_service/main.py
COPY ./src /usr/src/vessel_tracker_service/src

WORKDIR /usr/src
ENTRYPOINT [ "gunicorn", "vessel_tracker_service.main:flask_app", "--bind", "0.0.0.0:5000",  "--workers", "4" ]
