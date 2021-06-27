#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { VesselTrackerStack } from '../lib/vessel-tracker-stack';


let tpiPublicInterviewId: string
if (process.env.TPI_PUBLIC_INTERVIEW_ID) {
    tpiPublicInterviewId = process.env.TPI_PUBLIC_INTERVIEW_ID
} else {
  throw new Error("TPI_PUBLIC_INTERVIEW_ID environment variable is not set.")
}

const app = new cdk.App();
new VesselTrackerStack(app, 'VesselTracker', tpiPublicInterviewId, {
    description: "Do not modify manually!  Stack contains a Vessle Tracker API service accessable by an AWS Application Load Balancer.",
    tags: {
        'is_candidate_owned': 'true',
        'tpi_app_name': 'VesselTracker',
        'tpi_public_interview_id': tpiPublicInterviewId,
    },
    terminationProtection: false,
});
