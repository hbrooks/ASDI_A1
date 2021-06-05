import * as path from 'path';

import * as apigateway from '@aws-cdk/aws-apigateway';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import { EcrImageCode, Handler, Runtime } from '@aws-cdk/aws-lambda';


export class VesselTrackerStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaImage = EcrImageCode.fromAssetImage(path.join(__dirname, '..', 'vessel_tracker_service'));

    const lambda_ = new lambda.Function(this, "VesselTrackerLambda", {
      code: lambdaImage,
      functionName: 'VesselTrackerLambda',
      handler: Handler.FROM_IMAGE,
      runtime: Runtime.FROM_IMAGE,
      environment: {
        'SHIPPING_SERVICE_API_URL': 'www.google.com',
      },
    });

    const restApi = new apigateway.LambdaRestApi(this, 'VesselTrackerRestApi', {
      handler: lambda_,
    });

    new cdk.CfnOutput(this, "VesselTrackerRestApi", {
      value: restApi.url,
      exportName: "VesselTrackerRestApi",
    });

  }
}
