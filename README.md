# AWS Visitor Counter API

Serverless visitor counter API built with Node.js (TypeScript), AWS CDK, Lambda, API Gateway, and DynamoDB. Designed to run efficiently within the AWS Free Tier.

## Architecture

```text
[ Client ] -> [ API Gateway ] -> [ AWS Lambda ] -> [ DynamoDB ]
```

## Endpoints

- `POST /visit?pageId={id}` — Atomically increments and returns the visit count.
- `GET /visit?pageId={id}` — Returns the current visit count without incrementing.

## Usage & Testing

After deployment, CloudFormation outputs your base API endpoint URL (e.g., `https://<api-id>.execute-api.us-east-1.amazonaws.com/`).

### 1. Increment Counter (`POST`)

**PowerShell:**
```powershell
Invoke-RestMethod -Method Post -Uri "https://<api-id>.execute-api.us-east-1.amazonaws.com/visit?pageId=portfolio"
```

**cURL:**
```bash
curl -X POST "https://<api-id>.execute-api.us-east-1.amazonaws.com/visit?pageId=portfolio"
```

### 2. Retrieve Counter (`GET`)

**PowerShell:**
```powershell
Invoke-RestMethod -Method Get -Uri "https://<api-id>.execute-api.us-east-1.amazonaws.com/visit?pageId=portfolio"
```

**cURL:**
```bash
curl "https://<api-id>.execute-api.us-east-1.amazonaws.com/visit?pageId=portfolio"
```

## Engineering Trade-off

The core logic, data access, and HTTP response handling are co-located in a single file (`src/counter.ts`) to minimize Lambda Cold Starts and remove unnecessary abstraction layers for a single-purpose microservice.

## Quick Start

```bash
npm install
cdk bootstrap
cdk deploy
```