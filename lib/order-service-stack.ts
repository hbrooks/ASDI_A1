import * as path from 'path';

import * as apigateway from '@aws-cdk/aws-apigateway';
import * as cdk from '@aws-cdk/core';
import * as rds from '@aws-cdk/aws-rds';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as lambda from '@aws-cdk/aws-lambda';
import { EcrImageCode, Handler, Runtime } from '@aws-cdk/aws-lambda';


export class OrderServiceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'OrdersVpc', {})

    const database = new rds.DatabaseInstance(this, 'OrdersDatabase', {
      storageEncrypted: false, 
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_12_5
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE,
      },
      vpc,
      databaseName: 'OrdersDatabase',
      publiclyAccessible: true,
    });

    const lambdaImage = EcrImageCode.fromAssetImage(path.join(__dirname, '..', 'orders_api'));

    const lambda_ = new lambda.Function(this, "OrdersLambda", {
      code: lambdaImage,
      functionName: 'OrdersLambdaService',
      handler: Handler.FROM_IMAGE,
      runtime: Runtime.FROM_IMAGE,
      vpc: vpc,
      environment: {
        'SHIPPING_SERVICE_API_URL': 'www.google.com',
        'DATABASE_ENDPOINT': database.instanceEndpoint.hostname,
        'DATABASE_PORT': database.instanceEndpoint.port.toString(),
        'DATABASE_USER': 'postgres',
        'DATABASE_NAME': 'OrdersDatabase',
        'DATABASE_PASSWORD': 'OrdersDatabase',
      },
    });

    const restApi = new apigateway.LambdaRestApi(this, 'OrdersRestApi', {
      handler: lambda_,
    });

    // new rds.DatabaseClusterFromSnapshot(stack, 'Database', {
    //   engine: rds.DatabaseClusterEngine.aurora({ version: rds.AuroraEngineVersion.VER_1_22_2 }),
    //   instanceProps: {
    //     vpc,
    //   },
    //   snapshotIdentifier: 'mySnapshot',
    // });

    new cdk.CfnOutput(this, "OrdersRestApiUrl", {
      value: restApi.url,
      exportName: "OrdersRestApiUrl",
    });

  }
}
