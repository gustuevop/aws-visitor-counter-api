# AWS Visitor Counter API

Serverless visitor counter API built with Node.js (TypeScript), AWS CDK, Lambda, API Gateway, and DynamoDB. Designed for the AWS Free Tier.

## Architecture
[ Client ] -> [ API Gateway ] -> [ AWS Lambda ] -> [ DynamoDB ]

## Endpoints
* POST /visit?pageId={id} — Atomically increments and returns the visit count.
* GET /visit?pageId={id} — Returns the current visit count.

## Engineering Trade-off
The core logic, data access, and handler are co-located in a single file (`src/counter.ts`) to minimize Lambda Cold Starts and remove unnecessary abstraction layers for a single-purpose microservice.

## Quick Start
npm install
cdk bootstrap
cdk deploy