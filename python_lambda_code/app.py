import sys

from json import dumps


def handler(event, context):
    """
    https://aws.amazon.com/premiumsupport/knowledge-center/malformed-502-api-gateway/
    """
    return {
        "isBase64Encoded": False,
        "statusCode": 200,
        "headers": { },
        "body": dumps({"message": 'Hello from AWS Lambda using Python' + sys.version + '!'})
    }
