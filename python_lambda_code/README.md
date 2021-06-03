### Lambdas deployed using Containers!
As of ReInvent2020 we can (finally!) deploy Lambda functions using Docker Containers instead of zip files.

### To Develop
1.  Name your container, then `docker build -t myfunction:latest .` where `myfunction` is the name you choose.
2.  `docker run -p 9000:8080  myfunction:latest `
3.  Test using `curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{}'`

## More Reading:
https://docs.aws.amazon.com/lambda/latest/dg/images-test.html
https://docs.aws.amazon.com/lambda/latest/dg/images-create.html#images-create-1.title
https://docs.aws.amazon.com/lambda/latest/dg/python-image.html
https://pypi.org/project/awslambdaric/