import logging


from flask import Flask
from flask import request
from werkzeug.exceptions import UnprocessableEntity

from .src.request_parser import RequestParser
from .src.trip_update import TripUpdate


LOG = logging.getLogger()
LOG.setLevel(logging.INFO)


request_parser = RequestParser()
flask_app = Flask(__name__)


@flask_app.route('/health', methods=['GET'])
def handle_health_check():
    return {"isHealthy": True,}, 200


@flask_app.route('/trip', methods=['POST'])
def handle_trip_update():
    update: TripUpdate = request_parser.parse_trip_update_event(request.body)
    return update.to_dict(), 200


@flask_app.errorhandler(UnprocessableEntity)
def handle_unprocessable_entity(e):
    return {'message': 'UnprocessableEntity'}, 422
