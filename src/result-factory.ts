import { APIGatewayProxyResult } from 'aws-lambda'

export const resultFactory = (
  status: number,
  jsonPayload: Record<string, unknown>
): APIGatewayProxyResult => {
  return {
    isBase64Encoded: false,
    statusCode: status,
    body: JSON.stringify(jsonPayload),
    headers: { 'content-type': 'application/json' },
  }
}
