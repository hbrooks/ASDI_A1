#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { VesselTrackerStack } from '../lib/vessel-tracker-stack';

const app = new cdk.App();
new VesselTrackerStack(app, 'VesselTrackerStack');
