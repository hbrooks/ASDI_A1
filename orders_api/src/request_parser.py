from order_api.src.address import Address
from order_api.src.shopping_cart_entry import ShoppingCartEntry

class RequestParser():

    @staticmethod
    def parse_shopping_cart(dict_of_shopping_cart):
        return [ShoppingCartEntry()]

    @staticmethod
    def parse_address(dictionary_of_address):
        return Address()
