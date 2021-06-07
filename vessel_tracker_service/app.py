# import logging


# from vessel_tracker_service.src.api_gw_request import ApiGwRequest
# from vessel_tracker_service.src.response_creator import ResponseCreator
# from vessel_tracker_service.src.request_parser import RequestParser
# from vessel_tracker_service.src.trip_update import TripUpdate


# LOG = logging.getLogger()
# LOG.setLevel(logging.INFO)


# response_creator = ResponseCreator()
# request_parser = RequestParser()


# def handler(event):
#     LOG.debug(f'event received: {event}')
#     try:
#         api_gateway_request = ApiGwRequest(event)

#         if api_gateway_request.httpMethod == 'GET' and api_gateway_request.path == '/healthCheck':
#             return response_creator.create_response_for_API_GW(
#                 200,
#                 body={"isHealthy": True,})

#         elif api_gateway_request.httpMethod == 'POST' and api_gateway_request.path == '/tripUpdate':
#             update: TripUpdate = request_parser.parse_aws_lambda_event(event)
#             return response_creator.create_response_for_API_GW(
#                 200,
#                 body=update.to_dict())

#         else:
#             return response_creator.create_response_for_API_GW(
#                 400,
#                 body={"isHealthy": True, 'message': 'HTTP verb and path combination not supported.'})
    
#     except Exception as e:
#         return response_creator.create_response_for_API_GW(
#             500,
#             body={"isHealthy": False, 'error': str(e.with_traceback())})


from flask import Flask
app = Flask(__name__)

@app.route('/healthCheck', method=['GET'])
def hello_world():
    return {"isHealthy": True,}


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
