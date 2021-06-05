import logging


from requests import request


LOG = logging.getLogger()
LOG.setLevel(logging.INFO)


class ShippingServiceClient():

    def __init__(self, shipping_service_api_url):
        if shipping_service_api_url == None:
            raise ValueError(f'Expected shipping_service_api_url not to be None.')
        self.base_url = shipping_service_api_url

    def estimate_package_arrival_date(self, address):
        response = request(
            url=f'{self.base_url}/createEstimate',
            method='POST',
            body={

            },
            headers={
                'content-type': 'application/json',
                'accept': 'application/json'
            }
        )
        LOG.debug(f'Raw Response from Shipping Service: {response.text}')
        response.raise_for_status()
        parsed_response = response.json()
        return parsed_response['estimate']