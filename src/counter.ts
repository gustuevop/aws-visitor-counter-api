import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

const dbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dbClient);

const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  const httpMethod = event.requestContext.http.method;
  const pageId = event.queryStringParameters?.pageId || 'home';

  try {
    if (httpMethod === 'POST') {
      const command = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id: pageId },
        UpdateExpression: 'ADD visits :inc',
        ExpressionAttributeValues: { ':inc': 1 },
        ReturnValues: 'UPDATED_NEW',
      });

      const response = await docClient.send(command);

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Visita registrada com sucesso!',
          pageId,
          visits: response.Attributes?.visits,
        }),
      };
    }

    if (httpMethod === 'GET') {
      const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { id: pageId },
      });

      const response = await docClient.send(command);
      const visits = response.Item?.visits || 0;

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId,
          visits,
        }),
      };
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método não permitido.' }),
    };

  } catch (error) {
    console.error('Erro na execução:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erro interno no servidor.', error: (error as Error).message }),
    };
  }
};