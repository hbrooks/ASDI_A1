import logging
import os


from orders_api.src.api_gw_request import ApiGwRequest
from orders_api.src.item_manager import ItemManager
from orders_api.src.order_manager import OrderManager
from orders_api.src.response_creator import ResponseCreator
from orders_api.src.shipping_service_client import ShippingServiceClient
from orders_api.src.request_parser import RequestParser
from orders_api.src.database_client import DatabaseClient



LOG = logging.getLogger()
LOG.setLevel(logging.INFO)


response_creator = ResponseCreator()
item_manager = ItemManager()
shipping_service_client = ShippingServiceClient(os.environ.get('SHIPPING_SERVICE_API_URL', None))
db_client = DatabaseClient(
    os.environ.get('DATABASE_ENDPOINT'),
    os.environ.get('DATABASE_PORT'),
    os.environ.get('DATABASE_USER'),
    os.environ.get('DATABASE_NAME'),
    os.environ.get('DATABASE_PASSWORD'),
)
order_manager = OrderManager(db_client, shipping_service_client, item_manager)


def handler(event, context):
    LOG.debug(f'event received: {event}')
    try:
        api_gateway_request = ApiGwRequest(event)

        if api_gateway_request.path == '/healthCheck' and api_gateway_request.httpMethod == 'GET':
            return response_creator.create_response_for_API_GW(
                200,
                body={"isHealthy": True,})

        elif api_gateway_request.path.starts_with('/orders'):
            order = None
            if api_gateway_request.httpMethod == 'GET':
                order_id = api_gateway_request.path.split('/')[1]
                order = order_manager.get_order(order_id)
                if order == None:
                    return response_creator.create_response_for_API_GW(404)

            elif api_gateway_request.httpMethod == 'POST':
                shopping_cart = RequestParser.parse_shopping_cart(api_gateway_request.body['shopping_cart'])
                address = RequestParser.parse_address(api_gateway_request.body['address'])
                order = order_manager.create_order(
                    api_gateway_request.body['metadata'],
                    shopping_cart,
                    address)
                     
            if order != None:
                return response_creator.create_response_for_API_GW(
                    500,
                    body={"isHealthy": True, 'order': order.to_dict()})
        else:
            raise NotImplementedError(
                f'The combination of {api_gateway_request.httpMethod} {api_gateway_request.path} is not implemented in this service.')
    
    except Exception as e:
        return response_creator.create_response_for_API_GW(
            500,
            body={"isHealthy": False, 'error': str(e.with_traceback())})
