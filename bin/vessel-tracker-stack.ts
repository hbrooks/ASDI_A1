#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { triggerAsyncId } from 'async_hooks';
import { VesselTrackerStack } from '../lib/vessel-tracker-stack';

declare var process : {
    env: {
        TPI_PUBLIC_INTERVIEW_ID: string
    }
}

const app = new cdk.App();
new VesselTrackerStack(app, 'VesselTracker', process.env["TPI_PUBLIC_INTERVIEW_ID"], {
    description: "Do not modify manually!  Stack contains a Vessle Tracker API service accessable by an AWS Application Load Balancer.",
    tags: {
        'is_candidate_owned': 'true',
        'tpi_app_name': 'VesselTracker',
    },
    terminationProtection: false,
});
