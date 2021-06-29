import * as path from 'path';


import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as lambda from '@aws-cdk/aws-lambda';
import { EcrImageCode, Handler, Runtime } from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';

export class VesselTrackerStack extends cdk.Stack {
  /**
   * See https://github.com/aws-samples/http-api-aws-fargate-cdk.
   */
  
  constructor(scope: cdk.App, id: string, disambiguator: string, props?: cdk.StackProps) {
    super(scope, id+'-'+disambiguator, props);

    const lambdaImage = EcrImageCode.fromAssetImage(path.join(__dirname, '..', 'vessel_tracker_service'));

    const handler = new lambda.Function(this, "Lambda", {
      code: lambdaImage,
      handler: Handler.FROM_IMAGE,
      runtime: Runtime.FROM_IMAGE,
    });

    const api = new apigateway.RestApi(this, "Rest API GW", {
      restApiName: 'VesselService-' + disambiguator,
      description: "Don't modify manually!  Automatically created by CDK via a push to GitHub."
    });

    const lambdaIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    const apiGwProxyResource = new apigateway.Resource(this, 'ApiGatewayResource', {
      parent: api.root,
      pathPart: '{proxy+}'
    })
    apiGwProxyResource.addMethod('ANY', lambdaIntegration)

    new cdk.CfnOutput(this, "ApiUrl", {
      value: api.url
    });

  }


}
