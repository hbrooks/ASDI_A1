import * as path from 'path';


import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';

export class VesselTrackerStack extends cdk.Stack {
  /**
   * See https://github.com/aws-samples/http-api-aws-fargate-cdk.
   */
  
  constructor(scope: cdk.App, id: string, disambiguator: string, props?: cdk.StackProps) {
    super(scope, id+'-'+disambiguator, props);

    const vpc = new ec2.Vpc(this, "Vessel Service VPC", {
      maxAzs: 2 // Default is all AZs in region
    });

    const cluster = new ecs.Cluster(this, "Vessel Service ECS", {
      vpc: vpc,
    });

    const image = new DockerImageAsset(this, 'Vessel Service Docker Image', {
      directory: path.join(__dirname, '..', 'vessel_tracker_service')
    });

    // Create a load-balanced Fargate service and make it public
    const vesselService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "Vessel Service", {
      cluster: cluster, // Required
      cpu: 256, // Default is 256
      desiredCount: 1, // Default is 1
      taskImageOptions: { 
        image: ecs.ContainerImage.fromDockerImageAsset(image),
        containerPort: 5000,
      },
      minHealthyPercent: 50, 
      maxHealthyPercent: 200,
      memoryLimitMiB: 512, // Default is 512
      publicLoadBalancer: true, // Default is false
      serviceName: 'VesselService-' + disambiguator,
    });

    new cdk.CfnOutput(this, "ApiUrl", {
      value: vesselService.loadBalancer.loadBalancerDnsName
    });

  }


}
