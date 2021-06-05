import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { OrderServiceStack } from '../lib/order-service-stack';

test('SQS Queue Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new OrderServiceStack(app, 'OrderServiceStack');
    // THEN
    expectCDK(stack).to(haveResource("AWS::SQS::Queue",{
      VisibilityTimeout: 300
    }));
});

test('SNS Topic Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new OrderServiceStack(app, 'OrderServiceStack');
  // THEN
  expectCDK(stack).to(haveResource("AWS::SNS::Topic"));
});
