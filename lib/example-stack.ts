import * as path from 'path';

import * as apigateway from '@aws-cdk/aws-apigateway';
import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as sqs from '@aws-cdk/aws-sqs';
import * as lambda from '@aws-cdk/aws-lambda';
import { EcrImageCode, Handler, Runtime } from '@aws-cdk/aws-lambda';


export class ExampleStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, 'MyExampleQueue', {
      visibilityTimeout: cdk.Duration.seconds(300)
    });

    const topic = new sns.Topic(this, 'MyExampleTopic');

    topic.addSubscription(new subs.SqsSubscription(queue));

    const lambdaImage = EcrImageCode.fromAssetImage(path.join(__dirname, '..', 'python_lambda_code'));

    const handler = new lambda.Function(this, "MyExampleLambdaHandler", {
      code: lambdaImage,
      handler: Handler.FROM_IMAGE,
      runtime: Runtime.FROM_IMAGE,
    });

    const api = new apigateway.RestApi(this, "MyExampleRestApi", {
      restApiName: "MyExampleRestApi",
      description: "Automatically created by CDK via a push to GitHub."
    });

    const lambdaIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    api.root.addMethod("GET", lambdaIntegration); // GET /

    new cdk.CfnOutput(this, "SetOutput", {
      value: api.url,
      exportName: "MyExampleRestApiUrl",
    });
  }
}
