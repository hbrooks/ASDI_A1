import logging


LOG = logging.getLogger()
LOG.setLevel(logging.INFO)


class ApiGwRequest():
    EXPECTED_FIELDS_IN_EVENT = {
        'resource',
        'path',
        'httpMethod',
        'headers',
        'multiValueHeaders',
        'queryStringParameters',
        'multiValueQueryStringParameters',
        'pathParameters',
        'stageVariables',
        'body',
        'isBase64Encoded'
    }

    def __init__(self, dictionary_of_event):
        for expected_field_name in self.EXPECTED_FIELDS_IN_EVENT:
            if expected_field_name not in dictionary_of_event:
                raise ValueError(
                    f'expected event to contain {expected_field_name}')
            setattr(self, expected_field_name,
                    dictionary_of_event[expected_field_name])
