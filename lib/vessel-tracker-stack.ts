import * as path from 'path';


import * as cdk from "@aws-cdk/core";
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda';
import { EcrImageCode, Handler, Runtime } from '@aws-cdk/aws-lambda';

export class VesselTrackerStack extends cdk.Stack {
  /**
   * See https://github.com/aws-samples/http-api-aws-fargate-cdk.
   */
  
  constructor(scope: cdk.App, id: string, disambiguator: string, props?: cdk.StackProps) {
    super(scope, id + '-' + disambiguator, props);

    const lambdaImage = EcrImageCode.fromAssetImage(path.join(__dirname, '..', 'vessel_tracker_service'));

    const handler = new lambda.Function(this, "Lambda", {
      code: lambdaImage,
      handler: Handler.FROM_IMAGE,
      runtime: Runtime.FROM_IMAGE,
      timeout: cdk.Duration.seconds(10),
    });

    const api = new apigateway.RestApi(this, "Rest API GW", {
      restApiName: 'VesselService-' + disambiguator,
      description: "Don't modify manually!  Automatically created by CDK via a push to GitHub."
    });

    const lambdaIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    const healthResource = api.root.addResource("health")
    healthResource.addMethod("GET", lambdaIntegration); // Adds GET /health

    const tripResource = api.root.addResource("trip")
    tripResource.addMethod("POST", lambdaIntegration); // Adds POST /trip

    new cdk.CfnOutput(this, "SetOutput", {
      value: api.url,
      exportName: `ApiUrl-{disambiguator}`,
    });


    // const vpc = new ec2.Vpc(this, "Vessel Service VPC", {
    //   maxAzs: 2 // Default is all AZs in region
    // });

    // const cluster = new ecs.Cluster(this, "Vessel Service ECS", {
    //   vpc: vpc,
    // });

    // const image = new DockerImageAsset(this, 'Vessel Service Docker Image', {
    //   directory: path.join(__dirname, '..', 'vessel_tracker_service')
    // });

    // // Create a load-balanced Fargate service and make it public
    // const vesselService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "Vessel Service", {
    //   cluster: cluster, // Required
    //   cpu: 256, // Default is 256
    //   desiredCount: 1, // Default is 1
    //   taskImageOptions: { 
    //     image: ecs.ContainerImage.fromDockerImageAsset(image),
    //     containerPort: 5000,
    //   },
    //   minHealthyPercent: 50, 
    //   maxHealthyPercent: 200,
    //   memoryLimitMiB: 512, // Default is 512
    //   publicLoadBalancer: true, // Default is false
    //   serviceName: 'VesselService-' + disambiguator,
    // });
  }
}
