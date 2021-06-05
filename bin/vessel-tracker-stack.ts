#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { OrderServiceStack } from '../lib/order-service-stack';

const app = new cdk.App();
new OrderServiceStack(app, 'OrderServiceStack');
