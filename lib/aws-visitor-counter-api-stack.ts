import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as runtime from 'aws-cdk-lib/aws-lambda';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigatewayv2Integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';

export class AwsVisitorCounterApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const visitsTable = new dynamodb.Table(this, 'VisitsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const counterLambda = new lambdaNodejs.NodejsFunction(this, 'CounterLambda', {
      entry: 'src/counter.ts',
      handler: 'handler',
      runtime: runtime.Runtime.NODEJS_20_X,
      environment: {
        TABLE_NAME: visitsTable.tableName,
      },
    });

    visitsTable.grantReadWriteData(counterLambda);

    const httpApi = new apigatewayv2.HttpApi(this, 'VisitorCounterApi', {
      description: 'Visitor Counter API using AWS Lambda and DynamoDB',
      corsPreflight: {
        allowHeaders: ['Content-Type'],
        allowMethods: [
          apigatewayv2.CorsHttpMethod.GET,
          apigatewayv2.CorsHttpMethod.POST,
          apigatewayv2.CorsHttpMethod.OPTIONS,
        ],
        allowOrigins: ['*'],
      },
    });

    const lambdaIntegration = new apigatewayv2Integrations.HttpLambdaIntegration(
      'LambdaIntegration',
      counterLambda
    );

    httpApi.addRoutes({
      path: '/visit',
      methods: [apigatewayv2.HttpMethod.GET, apigatewayv2.HttpMethod.POST],
      integration: lambdaIntegration,
    });

    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: httpApi.url ?? 'Error retrieving URL',
      description: 'API Gateway endpoint URL for the Visitor Counter API',
    });
  }
}