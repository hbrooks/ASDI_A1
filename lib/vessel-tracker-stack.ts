import * as path from 'path';


import * as cdk from "@aws-cdk/core";
import * as elbv2 from "@aws-cdk/aws-elasticloadbalancingv2";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecr from "@aws-cdk/aws-ecr";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';
import * as ecrdeploy from '@aws-cdk/aws-ecr-assets';
import * as servicediscovery from "@aws-cdk/aws-servicediscovery";

export class VesselTrackerStack extends cdk.Stack {
  /**
   * See https://github.com/aws-samples/http-api-aws-fargate-cdk.
   */
  
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "MyVpc", {
      maxAzs: 2 // Default is all AZs in region
    });

    const cluster = new ecs.Cluster(this, "MyCluster", {
      vpc: vpc
    });

    const image = new DockerImageAsset(this, 'MyBuildImage', {
      directory: path.join(__dirname, '..', 'vessel_tracker_service')
    });

    // new ecrdeploy.ECRDeployment(this, 'DeployDockerImage', {
    //   src: new ecrdeploy.DockerImageName(image.imageUri),
    //   dest: new ecrdeploy.DockerImageName(`${cdk.Aws.ACCOUNT_ID}.dkr.ecr.us-west-2.amazonaws.com`),
    // });

    // Create a load-balanced Fargate service and make it public
    new ecs_patterns.ApplicationLoadBalancedFargateService(this, "MyFargateService", {
      cluster: cluster, // Required
      cpu: 256, // Default is 256
      desiredCount: 2, // Default is 1
      taskImageOptions: { image: ecs.ContainerImage.fromDockerImageAsset(image)},
      memoryLimitMiB: 512, // Default is 512
      publicLoadBalancer: true // Default is false
    });
  }
}
