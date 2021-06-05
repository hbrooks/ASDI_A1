from json import dumps


class ResponseCreator():
    def __init__(self):
        pass

    def create_response_for_API_GW(http_status_code, headers={}, body={}):
        """
        https://aws.amazon.com/premiumsupport/knowledge-center/malformed-502-api-gateway/
        """
        return {
            "isBase64Encoded": False,
            "statusCode": http_status_code,
            "headers": {
                'content-type': 'application/json',
                **headers
            },
            "body": dumps(body)
        }
