from uuid import uuid4

from orders_api.src.order import Order
from orders_api.src.database_client import DatabaseClient
from orders_api.src.shipping_service_client import ShippingServiceClient
from orders_api.src.item_manager import ItemManager


class OrderManager():

    def __init__(self, db_client: DatabaseClient, shipping_service_client: ShippingServiceClient, item_manager: ItemManager):
        self.db_client: DatabaseClient = db_client 
        self.shipping_service_client: ShippingServiceClient = shipping_service_client
        self.item_manager: ItemManager = item_manager
        
    def get_order(self, order_number):
        raise NotImplementedError()

    def create_order(self, metadata, shopping_cart, address):
        estimated_delivery_date = self.shipping_service_client.estimate_package_arrival_date(address)
        order_id = str(uuid4())
        final_price = self._calculate_final_price(shopping_cart)
        placed_at = metadata['placedAt']
        address_street_number = address.street_number
        address_street = , address_state, address_zip
        with self.db_client.conn.cursor() as cur:
            cur.execute(
                """insert into orders (order_id, estimated_delivery_date, final_price, placed_at, address_street_number, address_street, address_state, address_zip)
                 values (%s, %s, %s)""",
                (order_id, estimated_delivery_date, final_price, placed_at, address_street_number, address_street, address_state, address_zip)
            )
        return Order(
            shopping_cart,
            address,
            final_price,
            placed_at,
            estimated_delivery_date
        )

    def _calculate_final_price(self, shopping_cart):
        current_cost = 0
        return current_cost
